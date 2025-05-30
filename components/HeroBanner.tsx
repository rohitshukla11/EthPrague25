'use client';

import React from "react";
import Link from "next/link";
import Image from 'next/image';

const HeroBanner: React.FC = () => {
  return (
    <div className="bg-gradient-to-b text-gray-900">
      {/* Hero Section */}
      <section>
        <div className="px-10 py-24 bg-softPurple rounded-2xl relative h-[500px] leading-[0.9] w-full">
          <div>
            <div className="relative h-[150px] w-[150px]">
              <Image
                src="/assets/images/logo.png"
                alt="welcome"
                fill
                className="object-contain ml-[-5px]"
              />
            </div>
            <div className="absolute top-0 right-[5%] h-full w-[500px]">
              <Image
                src="/assets/images/ipixel.png"
                alt="welcome"
                fill
                className="object-contain"
              />
            </div>

            <div>
              <h2 className="text-[2.5rem] font-semibold mt-6 font-funnel ">
                Preserving Prague's Historical Network.
              </h2>
              <div className="py-4 w-450 leading-[1.3] flex flex-col text-textDark">
                <p className="text-textMuted font-light text-left font-funnel">
                  Explore how agents collaborate to maintain and restore the intricate historical network of Prague, ensuring its cultural and architectural legacy endures for generations.
                </p>
              </div>
            </div>
          </div>
          <Link href="/explore">
            <button
              type="button"
              className="font-funnel bottom-[5%] mt-4 px-4 py-2 bg-primary text-white rounded-xl text-lg font-medium cursor-pointer z-[10000]"
            >
              Discover More
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HeroBanner;