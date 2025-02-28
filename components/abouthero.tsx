import React from "react";
import HeroSection from "./sections";
import { MotionDiv } from "./ui/animateOnEnter";
import { motion } from "framer-motion";

const AboutHero: React.FC = () => {
  return (
    <MotionDiv 
      className="flex flex-col gap-8 md:gap-12 items-center justify-center 
                 md:flex-row px-4 py-12 md:py-24 w-full max-w-7xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.img
        src="/images/fin.jpg"
        alt="About section visual"
        className="w-full max-w-[600px] md:w-1/2 rounded-xl shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay: 0.2 }}
      />

      <motion.video
        autoPlay
        muted
        loop
          playsInline
                preload="metadata"
        poster="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/coinspectrum.png"
        className="w-full max-w-[600px] md:w-1/2 rounded-xl shadow-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <source src="https://xmrjeomtnodlwoxjzjgy.supabase.co/storage/v1/object/public/license-images/coinspectrum.mp4?t=2025-01-23T06%3A33%3A13.924Z" type="video/mp4" />


      </motion.video>   
    </MotionDiv>
  );
};

export default AboutHero;
