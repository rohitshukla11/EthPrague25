import React from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner, FooterBanner } from "../components";

interface AgentCardProps {
  name: string;
  description: string;
  image: string;
  link: string;
}

const AgentCard: React.FC<AgentCardProps> = ({ name, description, image, link }) => (
  <Link href={link} className="block bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
    {image && (
      <div className="relative h-48 w-full mb-4 rounded-2xl overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          style={{ objectFit: 'cover' }}
          className="hover:scale-105 transition-transform duration-300"
        />
      </div>
    )}
    <h3 className="text-2xl font-bold text-gray-900">{name}</h3>
    <p className="text-gray-600 mt-2">{description}</p>
  </Link>
);

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <HeroBanner />

      {/* Introduction Section */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Preserving Prague's Historical Network</h2>
            <p className="text-xl text-gray-600">
              Explore how agents collaborate to maintain and restore the intricate historical network of Prague.
            </p>
          </div>
        </div>
      </div>

      {/* Agents Section */}
      <div className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Meet the Agents</h2>
            <p className="text-xl text-gray-600">
              Each agent plays a unique role in preserving Prague's historical network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AgentCard
              name="Architectural Analyst"
              description="Analyzes historical structures and provides restoration insights."
              image="/assets/agents/architect.png"
              link="/agent/architect"
            />
            <AgentCard
              name="Cultural Historian"
              description="Preserves cultural narratives and historical significance."
              image="/assets/agents/historian.png"
              link="/agent/historian"
            />
            <AgentCard
              name="Network Engineer"
              description="Maintains the connectivity of historical sites and pathways."
              image="/assets/agents/engineer.png"
              link="/agent/engineer"
            />
            <AgentCard
              name="Environmental Specialist"
              description="Ensures sustainable preservation of natural surroundings."
              image="/assets/agents/environment.png"
              link="/agent/environment"
            />
            <AgentCard
              name="Community Liaison"
              description="Engages with local communities to gather insights and support."
              image="/assets/agents/community.png"
              link="/agent/community"
            />
          </div>
        </div>
      </div>

      {/* Collaboration Section */}
      <div className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">How Agents Collaborate</h2>
            <p className="text-xl text-gray-600">
              Discover the synergy between agents as they work together to preserve Prague's historical network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Data Sharing</h3>
              <p className="text-gray-600">
                Agents exchange data to ensure accurate restoration and preservation.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Collaborative Planning</h3>
              <p className="text-gray-600">
                Joint efforts to create sustainable and culturally sensitive plans.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-2">Community Engagement</h3>
              <p className="text-gray-600">
                Involving local communities to gather insights and support preservation efforts.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Final CTA */}
      <FooterBanner />
    </div>
  );
}