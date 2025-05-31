import "../styles/globals.css";
import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Providers } from "./providers";

export const metadata = {
  title: 'PrahaVerse',
  description: 'Your one-stop application for exploring Prague, offering personalized itineraries, tour recommendations, and historical insights.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="bg-black">
          <main>
            <Providers>
              {children}
            </Providers>
          </main>
        </div>
      </body>
    </html>
  );
}
