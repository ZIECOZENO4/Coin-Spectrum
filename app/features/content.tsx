"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const features = [
  {
    name: "Crypto and Forex",
    icon: "🛠️",
    description: "Your no 1 broker platform, completing around 2000 trades per day.",
    image: "/cs4.jpg"
  },
  {
    name: "Real Estate",
    icon: "💰",
    description: "Coin Spectrum is one of the biggest real estate company in the world.",
    image: "/cs1.jpg"
  },
  {
    name: "Stocks",
    icon: "📊",
    description: "Invest on the stocks of Coin Spectrum as it high market value",
    image: "/cs2.jpg"
  },
  {
    name: "Cannabis",
    icon: "🤝",
    description: "Coin Specturm is the world top pioneer for market in Cannabis",
    image: "/cs.jpg"
  },
];

export default function FeaturesHero() {
  const [activeFeature, setActiveFeature] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % features.length);
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="bg-black">
      <div className="container flex flex-col px-6 py-4 mx-auto space-y-6 md:h-128 md:py-16 md:flex-row md:items-center md:space-x-6">
        <motion.div 
          className="flex flex-col items-center w-full md:flex-row md:w-1/2"
          key={activeFeature}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-center order-2 mt-6 md:mt-0 md:space-y-3 md:flex-col">
            {features.map((_, index) => (
              <button 
                key={index} 
                className={`w-3 h-3 mx-2 rounded-full md:mx-0 focus:outline-none ${
                  index === activeFeature ? 'bg-yellow-500' : 'bg-gray-300 hover:bg-blue-500'
                }`} 
              />
            ))}
          </div>

          <div className="max-w-lg md:mx-12 md:order-2">
            <h1 className="text-3xl font-medium tracking-wide text-gray-800 dark:text-white md:text-4xl">
              {features[activeFeature].name}
            </h1>
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {features[activeFeature].description}
            </p>
            <div className="mt-6">
              <Link href="/dashboard/deposit" className="block px-3 py-2 font-semibold text-center text-black transition-colors duration-200 transform bg-yellow-400 rounded-md md:inline hover:bg-yellow-600">
                Get Started
              </Link>
            </div>
          </div>
        </motion.div>

        <motion.div 
          className="flex items-center justify-center w-full h-96 md:w-1/2"
          key={`image-${activeFeature}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={features[activeFeature].image}
            alt={features[activeFeature].name}
            width={800}
            height={600}
            className="object-cover w-full h-full max-w-2xl rounded-md"
          />
        </motion.div>
      </div>
    </header>
  );
}
