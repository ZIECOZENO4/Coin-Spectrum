// import { AnimatedListDemo } from "@/components/aminated-list";
import { AnimatedListDemo } from "@/components/animated-list-calc";
import Blog1 from "@/components/blog1";
import MarqueeDemo from "@/components/comments";
import FAQ from "@/components/FAQ";
import Features from "@/components/features";
import Footer from "@/components/Footer";
import ImagesSliderDemo from "@/components/hero-section";
import StackitInvestment from "@/components/hero-section";
import Section from "@/components/sections-page";
import { TimelineDemo } from "@/components/timeline";
import React from "react";

const HomePage = () => {
  return (
    <main>
      <div className="div">
      <ImagesSliderDemo />
      </div>
      
      <Features />
      <div className="flex flex-col items-center justify-centers">
        <AnimatedListDemo />
      </div>
      
      <div className="div">
        <TimelineDemo />
      </div>
 
      <div className="div">
        <FAQ />
      </div>
      <div className="">
        <MarqueeDemo />
      </div>
      <div className="div">
        <Footer />
      </div>
    </main>
  );
};

export default HomePage;
