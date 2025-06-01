'use client';

import React from "react";
import Link from "next/link";
import Image from 'next/image';

const HeroBanner: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-b text-gray-900 min-h-screen">
      {/* Full-page background image */}
      <div className="absolute inset-0">
        <Image
          src="/assets/images/logo.png"
          alt="Preserving Prague's Historical Network"
          fill
          className="object-cover"
        />
      </div>

      {/* Content Section */}
      <div className="relative z-10 flex flex-col items-center justify-end min-h-screen text-center px-6 pb-10">
        <div className="bg-black bg-opacity-50 p-6 rounded-lg">
          <h2 className="text-[3rem] font-semibold font-funnel text-white">
            Preserving Prague's Historical Network.
          </h2>
          <p className="text-textMuted font-light mt-4 font-funnel text-white text-lg max-w-3xl">
            Explore how agents collaborate to maintain and restore the intricate historical network of Prague, ensuring its cultural and architectural legacy endures for generations.
          </p>
          <Link href="/agent">
            <button
              type="button"
              className="font-funnel mt-6 px-6 py-3 bg-primary text-white rounded-xl text-lg font-medium cursor-pointer"
            >
              Discover More
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;