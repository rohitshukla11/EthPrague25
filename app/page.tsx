"use client";
import React, {useState} from "react";
import Link from "next/link";
import Image from "next/image";
import { HeroBanner} from "../components";

export default function Home() {

  const [agent, setAgent] = useState(0);
  
  const handleAgentCall = async () => {

    try {
      // Call Agent One
      setAgent(1);
      console.log('Calling Agent One...');

      const response = await fetch('/api/historian', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch historical information');
      }

      const data = await response.json();
      console.log('Historian response:', data);
      alert(`Historian response: ${data.history}`);

      // Call Agent Two
      setAgent(2);
      console.log('Calling Agent Two...');

      const agentTwoResponse = await fetch('/api/tour-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
      });

      if (!agentTwoResponse.ok) {
        throw new Error('Failed to fetch historical information');
      }

      const dataAgentTwo = await agentTwoResponse.json();
      console.log('Historian response:', dataAgentTwo);
      alert(`Historian response: ${dataAgentTwo.history}`);

      // Call Agent Three
      setAgent(3);
      console.log('Calling Agent Three...');
      const agentThreeResponse = await fetch('/api/language-translator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
      });

      if (!agentThreeResponse.ok) {
        throw new Error('Failed to fetch historical information');
      }

      const dataAgentThree = await agentThreeResponse.json();
      console.log('Historian response:', dataAgentThree);
      alert(`Historian response: ${dataAgentThree.history}`);

      // Call Agent Four
      setAgent(4);
      console.log('Calling Agent Four...');
      const agentFourResponse = await fetch('/api/itinerary-planner', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: 'Tell me about the history of Prague.' }),
      });

      if (!agentThreeResponse.ok) {
        throw new Error('Failed to fetch historical information');
      }

      const dataAgentFour = await agentFourResponse.json();
      console.log('Historian response:', dataAgentFour);
      alert(`Historian response: ${dataAgentFour.history}`);

    } catch (error) {
      console.error('Error fetching historian data:', error);
      alert('Failed to fetch historical information.');
    }
  };

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
            <div
              onClick={handleAgentCall}
              className={"block bg-white rounded-3xl p-6 shadow-sm hover:shadow-md transition-all"}
            >
              <div className="relative h-48 w-full mb-4 rounded-2xl overflow-hidden">
                <Image
                  src={"/assets/agents/historian.png"}
                  alt={"name"}
                  fill
                  style={{ objectFit: 'cover' }}
                  className="hover:scale-105 transition-transform duration-300"
                />
              </div>

              <h3 className="text-2xl font-bold text-gray-900">name</h3>
              <p className="text-gray-600 mt-2">description</p>
            </div>
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
    </div>
  );
}