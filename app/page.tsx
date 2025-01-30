'use client'
import { AnimatedListDemo } from "@/components/animated-list-calc";
import Blog1 from "@/components/blog1";
import MarqueeDemo from "@/components/comments";
import FAQ from "@/components/FAQ";
import Features from "@/components/features";
import Footer from "@/components/Footer";
import ImagesSliderDemo from "@/components/hero-section";
import StackitInvestment from "@/components/hero-section";
import Section from "@/components/sections-page";
import Section2 from "@/components/sections-page2";
import { TimelineDemo } from "@/components/timeline";
import React from "react";
import GetInTouch from "./getintouch";
import ReferralCard from "@/components/dashboard/referral";

const HomePage = () => {
  React.useEffect(() => {
    // Get ref from URL parameters
    const params = new URLSearchParams(window.location.search);
    const refId = params.get('ref');
    
    if (refId) {
      // Store in localStorage
      localStorage.setItem('referralId', refId);
    }
  }, []);
  return (
    <main>
      <div className="div">
      <ImagesSliderDemo />
      </div>
      
      <Features />
      <div className="flex flex-col items-center justify-centers">
        <AnimatedListDemo />
      </div>
      <Section2 />
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
        <GetInTouch />
      </div>
    
      <div className="div">
        <Footer />
      </div>

    </main>
  );
};

export default HomePage;
