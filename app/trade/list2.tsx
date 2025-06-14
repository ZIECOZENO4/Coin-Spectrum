"use client"

import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { ChevronRight } from 'lucide-react'
import { useRef, useState } from "react"
import Link from "next/link"

export default function PlatformSection() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.8,
        ease: [0.04, 0.62, 0.23, 0.98],
      },
    },
  }

  const features = [
    "Easy to use, fully customisable.",
    "Superior execution speeds",
    "Trader's calculator, performance statistics, sentiment",
  ]

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleError = (e: any) => {
    console.error("Error playing video:", e);
  };

  return (
    <div className="h-auto bg-black text-white py-8 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12">
          <motion.div
            className="flex-1 space-y-8"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.p 
              className="text-yellow-400 font-semibold tracking-wide"
              variants={item}
            >
              COIN SPECTRUM TRADERS
            </motion.p>
            
            <motion.h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
              variants={item}
            >
              Trade on our world class platform
            </motion.h1>

            <motion.div 
              className="space-y-4"
              variants={container}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  className="flex items-center gap-3"
                  variants={item}
                >
                  <ChevronRight className="w-5 h-5 text-yellow-400 flex-shrink-0" />
                  <p className="text-gray-300">{feature}</p>
                </motion.div>
              ))}
            </motion.div>

            <motion.div variants={item}>
            <Link href='/about'>
              <motion.button 
                className="bg-yellow-400 hover:bg-yellow-500  text-black font-semibold hover:underline px-8 py-4 text-md"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                LEARN MORE
              </motion.button>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div 
            className="w-full lg:w-1/2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-900">
              <video
                className="w-full h-full object-cover"
                ref={videoRef}
                poster="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/coinspectrum.png"
                playsInline
                preload="metadata"
                onError={handleError}
              >
                <source 
                  src="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/coinspectrum.mp4?t=2025-01-23T06%3A33%3A13.924Z" 
                  type="video/mp4" 
                />
                Your browser does not support the video tag.
              </video>
              
              <button 
                onClick={handlePlayPause}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-black bg-opacity-50 rounded-full flex items-center justify-center hover:bg-opacity-75 transition-all duration-200"
                aria-label={isPlaying ? "Pause video" : "Play video"}
              >
                <svg 
                  className="w-8 h-8 text-white" 
                  fill="currentColor" 
                  viewBox="0 0 24 24"
                >
                  {isPlaying ? (
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                  ) : (
                    <path d="M8 5v14l11-7z"/>
                  )}
                </svg>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
