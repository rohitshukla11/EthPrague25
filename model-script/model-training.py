"""
Enhanced Interactive CLI Prague Monuments QnA System with Lighthouse Storage

This script creates an interactive command-line interface for asking questions about Prague monuments.
Enhanced features:
- Better descriptive answers
- Sample questions for users
- Improved error handling
- Context-aware responses
- Enhanced monument data processing

Prerequisites:
- Python 3.8+
- scikit-learn, pandas, numpy, joblib, requests, colorama packages
- Lighthouse Storage API key
"""

import os
import json
import requests
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import joblib
import tempfile
import re
from collections import defaultdict
import time
from datetime import datetime
import sys

# Try to import colorama for colored output
try:
    from colorama import init, Fore, Back, Style
    init(autoreset=True)
    COLORS_AVAILABLE = True
except ImportError:
    print("Note: Install 'colorama' for colored output: pip install colorama")
    COLORS_AVAILABLE = False
    # Define dummy color constants
    class Fore:
        RED = GREEN = YELLOW = BLUE = MAGENTA = CYAN = WHITE = RESET = ""
    class Back:
        RED = GREEN = YELLOW = BLUE = MAGENTA = CYAN = WHITE = RESET = ""
    class Style:
        BRIGHT = DIM = NORMAL = RESET_ALL = ""

# Lighthouse API configuration
API_KEY = "d8a223eb.db12af24f2b848b09cf21c37bfa887ed"  # Replace with your actual API key
LIGHTHOUSE_API_BASE = "https://node.lighthouse.storage"

# List of your Prague monument JSON file CIDs
MONUMENT_CIDS = [
    "bafkreifcgc4pcfuyytmof2azmyg7re47dtbnunkr25ubvajf5b37cvso6i",
    "bafkreih7z6pplmi6s2zel4ju35cutymxhcxwxemlzcdff4p34pgrwbl62e",
    "bafkreih7z6pplmi6s2zel4ju35cutymxhcxwxemlzcdff4p34pgrwbl62e", 
    "bafkreifcgc4pcfuyytmof2azmyg7re47dtbnunkr25ubvajf5b37cvso6i"
]

# Enhanced monument database with key Prague monuments
FALLBACK_MONUMENTS = [
    {
        "name": "Prague Castle",
        "description": "Prague Castle is a castle complex built in the 9th century. It is the largest ancient castle complex in the world according to Guinness Book of Records, covering an area of almost 70,000 square meters. The castle has been a symbol of Czech statehood for more than a thousand years.",
        "construction_year": "880",
        "historical_period": "9th century - present",
        "architecture_style": "Gothic, Renaissance, Baroque",
        "location": "Hradčany, Prague Castle District",
        "type": "Castle Complex",
        "significance": "Official residence of the President of the Czech Republic, seat of Bohemian kings and Holy Roman emperors",
        "notable_figures": ["Prince Bořivoj", "Charles IV", "Rudolf II"],
        "historical_events": ["Founded by Prince Bořivoj around 880", "Became seat of Holy Roman Emperor", "St. Vitus Cathedral construction started in 1344"]
    },
    {
        "name": "Charles Bridge",
        "description": "Charles Bridge is a historic stone gothic bridge that connects the Old Town and Lesser Town. It was built to replace the older Judith Bridge that was badly damaged by a flood in 1342.",
        "construction_year": "1357-1402",
        "historical_period": "14th-15th century",
        "architecture_style": "Gothic",
        "location": "Over Vltava River, connecting Old Town and Lesser Town",
        "type": "Bridge",
        "significance": "One of Prague's most iconic landmarks, adorned with 30 baroque statues",
        "notable_figures": ["Charles IV", "Peter Parler"],
        "historical_events": ["Construction began in 1357", "Completed in early 15th century", "Baroque statues added in 17th-18th centuries"]
    },
    {
        "name": "Old Town Square",
        "description": "Old Town Square is a historic square in the Old Town quarter of Prague. It features Gothic churches, colorful baroque buildings and the famous Astronomical Clock.",
        "construction_year": "12th century",
        "historical_period": "Medieval - present",
        "architecture_style": "Gothic, Renaissance, Baroque",
        "location": "Old Town, Prague",
        "type": "Historic Square",
        "significance": "Historic center of Prague, site of many important historical events",
        "notable_figures": ["Jan Hus"],
        "historical_events": ["Medieval marketplace", "Site of Jan Hus execution in 1415", "1968 demonstrations"]
    },
    {
        "name": "Astronomical Clock",
        "description": "The Prague Astronomical Clock is a medieval astronomical clock attached to the Old Town Hall. It's the third-oldest astronomical clock in the world and the oldest clock still operating.",
        "construction_year": "1410",
        "historical_period": "15th century",
        "architecture_style": "Gothic",
        "location": "Old Town Hall, Old Town Square",
        "type": "Astronomical Clock",
        "significance": "Third-oldest astronomical clock in the world, major tourist attraction",
        "notable_figures": ["Master Hanuš", "Mikuláš of Kadaň"],
        "historical_events": ["Installed in 1410", "Legend of Master Hanuš blinding", "Renovated multiple times"]
    },
    {
        "name": "St. Vitus Cathedral",
        "description": "St. Vitus Cathedral is a Roman Catholic metropolitan cathedral located within Prague Castle complex. It is the seat of the Archbishop of Prague and contains the tombs of many Bohemian kings and Holy Roman Emperors.",
        "construction_year": "1344-1929",
        "historical_period": "14th-20th century",
        "architecture_style": "Gothic",
        "location": "Prague Castle complex",
        "type": "Cathedral",
        "significance": "Most important church in Czech Republic, coronation site of Bohemian kings",
        "notable_figures": ["Charles IV", "Peter Parler", "Matthias of Arras"],
        "historical_events": ["Construction started by Charles IV in 1344", "Completed in 1929", "Coronations of Bohemian kings"]
    }
]

class EnhancedPragueQnA:
    def __init__(self):
        self.monuments = []
        self.monument_texts = []
        self.tfidf_vectorizer = None
        self.tfidf_matrix = None
        self.keyword_index = defaultdict(list)
        self.question_history = []
        self.session_stats = {
            'questions_asked': 0,
            'session_start': datetime.now(),
            'monuments_referenced': set()
        }
        
    def print_colored(self, text, color=Fore.WHITE, style=Style.NORMAL):
        """Print colored text if colorama is available"""
        if COLORS_AVAILABLE:
            print(f"{style}{color}{text}{Style.RESET_ALL}")
        else:
            print(text)
    
    def print_banner(self):
        """Print welcome banner"""
        banner = """
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🏛️  PRAGUE MONUMENTS QnA SYSTEM 🏛️                      ║
║                    Enhanced Interactive CLI Interface                       ║
╚══════════════════════════════════════════════════════════════════════════════╝
        """
        self.print_colored(banner, Fore.CYAN, Style.BRIGHT)
        self.print_colored("Welcome to the Enhanced Prague Monuments Question & Answer System!", Fore.GREEN)
        self.print_colored("Get detailed information about Prague's most famous landmarks!\n", Fore.YELLOW)
    
    def print_help(self):
        """Print help information with sample questions"""
        help_text = """
┌─────────────────────────────────────────────────────────────────────────────┐
│                                 HELP MENU                                  │
├─────────────────────────────────────────────────────────────────────────────┤
│ COMMANDS:                                                                   │
│   help, h, ?          - Show this help menu                                │
│   samples, examples   - Show detailed question examples                     │
│   history, hist       - Show question history                              │
│   stats, statistics   - Show session statistics                            │
│   list, monuments     - List available monuments                           │
│   export              - Export session data                                │
│   clear, cls          - Clear screen                                       │
│   quit, exit, q       - Exit the program                                   │
│                                                                             │
│ QUICK QUESTION EXAMPLES:                                                    │
│   • What is Prague Castle?                                                 │
│   • When was Charles Bridge built?                                         │
│   • Where is the Astronomical Clock located?                               │
│   • Tell me about Gothic architecture in Prague                            │
│   • Who built St. Vitus Cathedral?                                         │
│   • What happened at Old Town Square?                                      │
│                                                                             │
│ Type 'samples' for more detailed examples and question patterns!           │
└─────────────────────────────────────────────────────────────────────────────┘
        """
        self.print_colored(help_text, Fore.CYAN)
    
    def show_sample_questions(self):
        """Show detailed sample questions"""
        samples_text = """
🎯 DETAILED QUESTION EXAMPLES & PATTERNS

📍 BASIC INFORMATION QUESTIONS:
   • "What is Prague Castle?"
   • "Tell me about Charles Bridge"
   • "Describe the Astronomical Clock"
   • "What can you tell me about Old Town Square?"

📅 HISTORICAL QUESTIONS:
   • "When was Prague Castle built?"
   • "When was Charles Bridge constructed?"
   • "What year was the Astronomical Clock installed?"
   • "How long did it take to build St. Vitus Cathedral?"

🏛️ ARCHITECTURAL QUESTIONS:
   • "What architectural style is Prague Castle?"
   • "What style is Charles Bridge built in?"
   • "Which monuments are Gothic in style?"
   • "Tell me about Renaissance architecture in Prague"

📍 LOCATION QUESTIONS:
   • "Where is Prague Castle located?"
   • "Where can I find the Astronomical Clock?"
   • "What district is Charles Bridge in?"

👥 HISTORICAL FIGURES:
   • "Who built Prague Castle?"
   • "Who designed Charles Bridge?"
   • "Which emperor founded St. Vitus Cathedral?"
   • "Who was Master Hanuš?"

🎭 HISTORICAL EVENTS:
   • "What historical events happened at Prague Castle?"
   • "What important events occurred at Old Town Square?"
   • "Tell me about the history of Charles Bridge"

💡 COMPARISON QUESTIONS:
   • "What's the difference between Prague Castle and other castles?"
   • "How old is the Astronomical Clock compared to other clocks?"
   • "Which is older - Charles Bridge or Prague Castle?"

🏆 SIGNIFICANCE QUESTIONS:
   • "Why is Prague Castle important?"
   • "What makes Charles Bridge special?"
   • "What's the significance of the Astronomical Clock?"

Try asking questions in natural language - the system understands context!
        """
        self.print_colored(samples_text, Fore.GREEN)
    
    def show_history(self):
        """Show question history"""
        if not self.question_history:
            self.print_colored("No questions asked yet in this session.", Fore.YELLOW)
            return
        
        self.print_colored("\n📜 Question History:", Fore.MAGENTA, Style.BRIGHT)
        self.print_colored("─" * 60, Fore.MAGENTA)
        
        for i, (timestamp, question, monument_count) in enumerate(self.question_history, 1):
            time_str = timestamp.strftime("%H:%M:%S")
            self.print_colored(f"{i:2d}. [{time_str}] {question}", Fore.WHITE)
            self.print_colored(f"    └─ Found {monument_count} relevant monument(s)", Fore.GREEN)
        
        self.print_colored("─" * 60, Fore.MAGENTA)
    
    def show_stats(self):
        """Show session statistics"""
        duration = datetime.now() - self.session_stats['session_start']
        duration_str = str(duration).split('.')[0]  # Remove microseconds
        
        stats_text = f"""
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SESSION STATISTICS                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Session Duration:     {duration_str:<50} │
│ Questions Asked:      {self.session_stats['questions_asked']:<50} │
│ Monuments in DB:      {len(self.monuments):<50} │
│ Monuments Referenced: {len(self.session_stats['monuments_referenced']):<50} │
│ Vocabulary Size:      {len(self.tfidf_vectorizer.vocabulary_) if self.tfidf_vectorizer else 0:<50} │
└─────────────────────────────────────────────────────────────────────────────┘
        """
        self.print_colored(stats_text, Fore.BLUE)
    
    def list_monuments(self):
        """List available monuments"""
        if not self.monuments:
            self.print_colored("No monuments loaded.", Fore.RED)
            return
        
        self.print_colored(f"\n🏛️  Available Monuments ({len(self.monuments)} total):", Fore.MAGENTA, Style.BRIGHT)
        self.print_colored("─" * 80, Fore.MAGENTA)
        
        for i, monument in enumerate(self.monuments, 1):
            name = self.safe_string(monument.get('name', f'Monument {i}'))
            monument_type = self.safe_string(monument.get('type', monument.get('category', 'Unknown type')))
            period = self.safe_string(monument.get('historical_period', monument.get('period', '')))
            year = self.safe_string(monument.get('construction_year', ''))
            
            self.print_colored(f"{i:2d}. {name}", Fore.WHITE, Style.BRIGHT)
            if monument_type != 'Unknown type':
                self.print_colored(f"    Type: {monument_type}", Fore.GREEN)
            if period:
                self.print_colored(f"    Period: {period}", Fore.YELLOW)
            if year:
                self.print_colored(f"    Built: {year}", Fore.CYAN)
        
        self.print_colored("─" * 80, Fore.MAGENTA)
    
    def export_session(self):
        """Export session data to JSON file"""
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        filename = f"prague_qna_session_{timestamp}.json"
        
        session_data = {
            'session_info': {
                'start_time': self.session_stats['session_start'].isoformat(),
                'export_time': datetime.now().isoformat(),
                'questions_asked': self.session_stats['questions_asked'],
                'monuments_referenced': list(self.session_stats['monuments_referenced'])
            },
            'question_history': [
                {
                    'timestamp': q[0].isoformat(),
                    'question': q[1],
                    'monument_count': q[2]
                }
                for q in self.question_history
            ]
        }
        
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(session_data, f, indent=2, ensure_ascii=False)
            self.print_colored(f"✓ Session data exported to: {filename}", Fore.GREEN)
        except Exception as e:
            self.print_colored(f"✗ Export failed: {e}", Fore.RED)
    
    def clear_screen(self):
        """Clear the terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')
        self.print_banner()
    
    def safe_string(self, field, default=''):
        """Safely extract string from field"""
        if isinstance(field, str):
            return field
        elif isinstance(field, dict):
            return field.get('name', field.get('value', field.get('text', str(field))))
        elif isinstance(field, list):
            return ' '.join([str(item) for item in field])
        elif field is None:
            return default
        else:
            return str(field)
    
    def download_from_lighthouse(self, cid, output_path):
        """Download a file from Lighthouse Storage using its CID"""
        print(f"Fetching monument data from CID: {cid}")
        gateway_url = f"https://gateway.lighthouse.storage/ipfs/{cid}"
        
        try:
            response = requests.get(gateway_url, timeout=30)
            
            if response.status_code == 200:
                with open(output_path, 'wb') as f:
                    f.write(response.content)
                print(f"✓ Downloaded successfully: {os.path.basename(output_path)}")
                return True
            else:
                print(f"✗ Download failed with status code: {response.status_code}")
                return False
        except Exception as e:
            print(f"✗ Download error: {e}")
            return False

    def load_monument_data(self):
        """Load all monument JSON files from Lighthouse with fallback"""
        all_monuments = []
        
        # Try to load from Lighthouse first
        try:
            with tempfile.TemporaryDirectory() as temp_dir:
                for i, cid in enumerate(MONUMENT_CIDS, 1):
                    file_path = os.path.join(temp_dir, f"monument_{i}.json")
                    
                    if self.download_from_lighthouse(cid, file_path):
                        try:
                            with open(file_path, 'r', encoding='utf-8') as f:
                                monument_data = json.load(f)
                            
                            if isinstance(monument_data, list):
                                all_monuments.extend(monument_data)
                            else:
                                all_monuments.append(monument_data)
                                
                        except json.JSONDecodeError as e:
                            print(f"✗ Error parsing JSON from {file_path}: {e}")
                        except Exception as e:
                            print(f"✗ Error loading {file_path}: {e}")
        except Exception as e:
            print(f"✗ Error accessing Lighthouse data: {e}")
        
        # If no monuments loaded or very few, use fallback data
        if len(all_monuments) < 3:
            print("⚠️  Using fallback monument database with key Prague landmarks")
            all_monuments.extend(FALLBACK_MONUMENTS)
        
        self.monuments = all_monuments
        return all_monuments

    def create_searchable_content(self):
        """Process monument data and create searchable text content"""
        monument_texts = []
        
        for i, monument in enumerate(self.monuments):
            name = self.safe_string(monument.get('name', ''))
            description = self.safe_string(monument.get('description', ''))
            historical_period = self.safe_string(monument.get('historical_period', monument.get('period', '')))
            architecture_style = self.safe_string(monument.get('architecture_style', monument.get('style', '')))
            construction_year = self.safe_string(monument.get('construction_year', monument.get('year', '')))
            location = self.safe_string(monument.get('location', monument.get('address', '')))
            monument_type = self.safe_string(monument.get('type', monument.get('category', '')))
            significance = self.safe_string(monument.get('significance', monument.get('importance', '')))
            
            historical_events = monument.get('historical_events', [])
            notable_figures = monument.get('notable_figures', [])
            
            if isinstance(historical_events, list):
                historical_events = ' '.join([self.safe_string(event) for event in historical_events])
            else:
                historical_events = self.safe_string(historical_events)
                
            if isinstance(notable_figures, list):
                notable_figures = ' '.join([self.safe_string(figure) for figure in notable_figures])
            else:
                notable_figures = self.safe_string(notable_figures)
            
            full_text = f"""
            Name: {name}
            Description: {description}
            Historical Period: {historical_period}
            Architecture Style: {architecture_style}
            Construction Year: {construction_year}
            Location: {location}
            Type: {monument_type}
            Significance: {significance}
            Historical Events: {historical_events}
            Notable Figures: {notable_figures}
            """.strip()
            
            monument_texts.append(full_text)
            
            # Enhanced keyword indexing
            keywords = []
            for field in [name, monument_type, historical_period, architecture_style, location]:
                if field and isinstance(field, str) and field.strip():
                    keywords.append(field.lower())
            
            # Add name-based keywords
            if name and isinstance(name, str):
                keywords.extend([word.lower() for word in name.split() if len(word) > 2])
            
            # Add description keywords
            if description and isinstance(description, str):
                desc_words = [word.lower().strip('.,!?;:') for word in description.split() if len(word) > 3]
                keywords.extend(desc_words[:10])  # Limit to avoid noise
            
            # Add historical figures as keywords
            if isinstance(notable_figures, str) and notable_figures:
                figure_words = [word.lower() for word in notable_figures.split() if len(word) > 2]
                keywords.extend(figure_words)
            
            for keyword in keywords:
                if keyword and keyword.strip():
                    self.keyword_index[keyword.strip()].append(i)
        
        self.monument_texts = monument_texts

    def build_tfidf_index(self):
        """Build TF-IDF index for semantic search"""
        self.tfidf_vectorizer = TfidfVectorizer(
            max_features=2000,
            stop_words='english',
            ngram_range=(1, 3),
            lowercase=True,
            min_df=1,
            max_df=0.95
        )
        
        self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(self.monument_texts)

    def find_relevant_monuments(self, question, top_k=3):
        """Find most relevant monuments for a given question"""
        question_vector = self.tfidf_vectorizer.transform([question])
        similarities = cosine_similarity(question_vector, self.tfidf_matrix).flatten()
        
        # Enhanced keyword matching
        question_words = set(question.lower().split())
        keyword_matches = []
        
        for word in question_words:
            # Direct keyword match
            if word in self.keyword_index:
                keyword_matches.extend(self.keyword_index[word])
            
            # Partial keyword matching for monument names
            for keyword in self.keyword_index.keys():
                if word in keyword or keyword in word:
                    if len(word) > 3 and len(keyword) > 3:  # Avoid short word matches
                        keyword_matches.extend(self.keyword_index[keyword])
        
        # Boost scores for keyword matches
        for idx in set(keyword_matches):
            if idx < len(similarities):
                similarities[idx] += 0.2
        
        # Get top results
        top_indices = similarities.argsort()[-top_k:][::-1]
        
        results = []
        for idx in top_indices:
            if similarities[idx] > 0.01:  # Lower threshold for better recall
                results.append({
                    'monument': self.monuments[idx],
                    'text': self.monument_texts[idx],
                    'score': similarities[idx]
                })
        
        return results

    def generate_enhanced_answer(self, question, relevant_monuments):
        """Generate enhanced, descriptive answers based on relevant monuments"""
        if not relevant_monuments:
            suggestions = [
                "What is Prague Castle?",
                "When was Charles Bridge built?",
                "Tell me about the Astronomical Clock",
                "Where is Old Town Square?",
                "Who built St. Vitus Cathedral?"
            ]
            return f"I don't have information about that topic in the Prague monuments database.\n\n💡 Try asking: {' • '.join(suggestions)}"
        
        question_lower = question.lower()
        best_match = relevant_monuments[0]
        monument = best_match['monument']
        
        # Extract monument information
        name = self.safe_string(monument.get('name', 'This monument'))
        description = self.safe_string(monument.get('description', ''))
        year = self.safe_string(monument.get('construction_year', ''))
        period = self.safe_string(monument.get('historical_period', ''))
        style = self.safe_string(monument.get('architecture_style', ''))
        location = self.safe_string(monument.get('location', ''))
        significance = self.safe_string(monument.get('significance', ''))
        notable_figures = monument.get('notable_figures', [])
        historical_events = monument.get('historical_events', [])
        
        # Question type detection and enhanced responses
        if any(word in question_lower for word in ['when', 'year', 'built', 'constructed', 'date']):
            answer_parts = []
            for result in relevant_monuments:
                m = result['monument']
                m_name = self.safe_string(m.get('name', 'This monument'))
                m_year = self.safe_string(m.get('construction_year', ''))
                m_period = self.safe_string(m.get('historical_period', ''))
                
                if m_year and str(m_year) != 'Unknown' and str(m_year).strip():
                    if '-' in str(m_year):
                        answer_parts.append(f"{m_name} was built between {m_year}")
                    else:
                        answer_parts.append(f"{m_name} was built in {m_year}")
                elif m_period:
                    answer_parts.append(f"{m_name} was built during the {m_period}")
            
            if answer_parts:
                base_answer = ". ".join(answer_parts) + "."
                if description:
                    base_answer += f"\n\n📜 Additional context: {description}"
                return base_answer
            else:
                return f"Construction dates are not available for {name}, but it dates from the {period} period." if period else "Construction date information is not available."
        
        elif any(word in question_lower for word in ['where', 'location', 'address', 'find', 'located']):
            answer_parts = []
            for result in relevant_monuments:
                m = result['monument']
                m_name = self.safe_string(m.get('name', ''))
                m_location = self.safe_string(m.get('location', ''))
                
                if m_location:
                    answer_parts.append(f"{m_name} is located at {m_location}")
            
            if answer_parts:
                base_answer = ". ".join(answer_parts) + "."
                if description:
                    base_answer += f"\n\n📍 Description: {description}"
                return base_answer
            else:
                return "Location information is not available in the database."
        
        elif any(word in question_lower for word in ['who', 'architect', 'designer', 'builder', 'founded', 'emperor', 'king']):
            answer_parts = []
            for result in relevant_monuments:
                m = result['monument']
                m_name = self.safe_string(m.get('name', ''))
                m_figures = m.get('notable_figures', [])
                
                if isinstance(m_figures, list) and m_figures:
                    figures_str = ', '.join([self.safe_string(fig) for fig in m_figures])
                    answer_parts.append(f"{m_name} is associated with {figures_str}")
                elif isinstance(m_figures, str) and m_figures:
                    answer_parts.append(f"{m_name} is associated with {m_figures}")
            
            if answer_parts:
                base_answer = ". ".join(answer_parts) + "."
                if description:
                    base_answer += f"\n\n🏛️ More details: {description}"
                return base_answer
            else:
                return f"Information about the people associated with {name} is not available in the database."
        
        elif any(word in question_lower for word in ['style', 'architecture', 'architectural', 'gothic', 'baroque', 'renaissance']):
            answer_parts = []
            for result in relevant_monuments:
                m = result['monument']
                m_name = self.safe_string(m.get('name', ''))
                m_style = self.safe_string(m.get('architecture_style', ''))
                
                if m_style:
                    answer_parts.append(f"{m_name} is built in {m_style} style")
            
            if answer_parts:
                base_answer = ". ".join(answer_parts) + "."
                if description:
                    base_answer += f"\n\n🏗️ Description: {description}"
                return base_answer
            else:
                return f"Architectural style information for {name} is not available."
        
        elif any(word in question_lower for word in ['what', 'describe', 'about', 'tell me', 'explain']):
            # Comprehensive description
            answer_parts = [f"🏛️ **{name}**"]
            
            if description:
                answer_parts.append(f"\n📜 **Description:** {description}")
            
            if year:
                if '-' in str(year):
                    answer_parts.append(f"\n📅 **Construction Period:** {year}")
                else:
                    answer_parts.append(f"\n📅 **Built:** {year}")
            elif period:
                answer_parts.append(f"\n📅 **Historical Period:** {period}")
            
            if style:
                answer_parts.append(f"\n🏗️ **Architectural Style:** {style}")
            
            if location:
                answer_parts.append(f"\n📍 **Location:** {location}")
            
            if significance:
                answer_parts.append(f"\n⭐ **Significance:** {significance}")
            
            if isinstance(notable_figures, list) and notable_figures:
                figures_str = ', '.join([self.safe_string(fig) for fig in notable_figures])
                answer_parts.append(f"\n👥 **Notable Figures:** {figures_str}")
            
            if isinstance(historical_events, list) and historical_events:
                events_str = '; '.join([self.safe_string(event) for event in historical_events[:3]])  # Limit to 3 events
                answer_parts.append(f"\n📚 **Historical Events:** {events_str}")
            
            return "".join(answer_parts)
        
        else:
            # General response for other questions
            answer = f"🏛️ **{name}**"
            
            if description:
                answer += f"\n\n{description}"
            
            if year and period:
                answer += f"\n\n📅 Built in {year} during the {period}."
            elif year:
                answer += f"\n\n📅 Built in {year}."
            elif period:
                answer += f"\n\n📅 From the {period}."
            
            if style:
                answer += f" Features {style} architecture."
            
            return answer

    def answer_question(self, question):
        """Answer a question and update statistics"""
        relevant_monuments = self.find_relevant_monuments(question, top_k=3)
        
        if not relevant_monuments:
            answer = self.generate_enhanced_answer(question, [])
            monument_count = 0
        else:
            answer = self.generate_enhanced_answer(question, relevant_monuments)
            monument_count = len(relevant_monuments)
            
            # Update statistics
            for result in relevant_monuments:
                monument_name = self.safe_string(result['monument'].get('name', ''))
                if monument_name:
                    self.session_stats['monuments_referenced'].add(monument_name)
        
        # Update session stats and history
        self.session_stats['questions_asked'] += 1
        self.question_history.append((datetime.now(), question, monument_count))
        
        # Display answer
        self.print_colored(f"\n💡 Answer:", Fore.GREEN, Style.BRIGHT)
        self.print_colored(answer, Fore.WHITE)
        
        if relevant_monuments:
            self.print_colored(f"\n📊 Based on {len(relevant_monuments)} relevant monument(s):", Fore.BLUE)
            for i, result in enumerate(relevant_monuments, 1):
                monument_name = result['monument'].get('name', f'Monument {i}')
                if isinstance(monument_name, dict):
                    monument_name = monument_name.get('name', monument_name.get('value', f'Monument {i}'))
                monument_name = self.safe_string(monument_name)
                self.print_colored(f"   {i}. {monument_name} (relevance: {result['score']:.3f})", Fore.CYAN)
        
        return answer

    def initialize_system(self):
        """Initialize the QnA system"""
        self.print_banner()
        
        # Load data
        self.print_colored("🔄 Loading monument data from Lighthouse...", Fore.YELLOW)
        monuments = self.load_monument_data()
        
        if not monuments:
            self.print_colored("❌ No monument data loaded. Please check your CIDs.", Fore.RED)
            return False
        
        self.print_colored(f"✅ Loaded {len(monuments)} monument records", Fore.GREEN)
        
        # Process data
        self.print_colored("🔄 Creating searchable content...", Fore.YELLOW)
        self.create_searchable_content()
        
        self.print_colored("🔄 Building search index...", Fore.YELLOW)
        self.build_tfidf_index()
        
        self.print_colored("✅ Enhanced QnA system ready!", Fore.GREEN, Style.BRIGHT)
        self.print_colored("Type 'help' for commands or 'samples' for detailed question examples.\n", Fore.CYAN)
        
        return True

    def run_interactive_session(self):
        """Run the main interactive session"""
        if not self.initialize_system():
            return
        
        while True:
            try:
                # Get user input
                self.print_colored("─" * 80, Fore.MAGENTA)
                user_input = input(f"{Fore.YELLOW if COLORS_AVAILABLE else ''}❓ Your question (or 'help' for assistance): {Style.RESET_ALL if COLORS_AVAILABLE else ''}").strip()
                
                if not user_input:
                    continue
                
                # Handle commands
                command = user_input.lower()
                
                if command in ['quit', 'exit', 'q']:
                    self.print_colored("\n👋 Thank you for using Enhanced Prague Monuments QnA! Goodbye!", Fore.GREEN, Style.BRIGHT)
                    break
                
                elif command in ['help', 'h', '?']:
                    self.print_help()
                
                elif command in ['samples', 'examples']:
                    self.show_sample_questions()
                
                elif command in ['history', 'hist']:
                    self.show_history()
                
                elif command in ['stats', 'statistics']:
                    self.show_stats()
                
                elif command in ['list', 'monuments']:
                    self.list_monuments()
                
                elif command == 'export':
                    self.export_session()
                
                elif command in ['clear', 'cls']:
                    self.clear_screen()
                
                else:
                    # Process as question
                    self.print_colored(f"\n🤔 Question: {user_input}", Fore.BLUE, Style.BRIGHT)
                    self.answer_question(user_input)
                
            except KeyboardInterrupt:
                self.print_colored("\n\n👋 Session interrupted. Goodbye!", Fore.YELLOW)
                break
            except EOFError:
                self.print_colored("\n\n👋 Session ended. Goodbye!", Fore.YELLOW)
                break
            except Exception as e:
                self.print_colored(f"\n❌ An error occurred: {e}", Fore.RED)
                self.print_colored("Please try again or type 'help' for assistance.", Fore.YELLOW)

def main():
    """Main function to run the interactive CLI"""
    try:
        qna_system = EnhancedPragueQnA()
        qna_system.run_interactive_session()
    except Exception as e:
        print(f"❌ Failed to start the application: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()