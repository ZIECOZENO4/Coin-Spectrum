

"use client";
import { motion } from "framer-motion";
import React from "react";
import ShineBorder from "./ui/shine-border-button";
import { ImagesSlider } from "./ui/image-slider";
import Link from "next/link";

function ImagesSliderDemo() {
  const images = [
    "/m22.jpg",
   "/m71.jpg",
   "/m78.jpg",
   "/m89.jpg",
   "/m9.jpg",
   "/m7.jpg",
   "/m2.jpg",
   "/m1.jpg",

  
  ];
  return (
    <ImagesSlider className="h-[40rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <div className="text-center flex flex-col items-center justify-center gap-4">
          <p className="mx-auto mb-4 max-w-4xl bg-gradient-to-r from-emerald-500 to-lime-600 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
            Coin Spectrum Investment Platform
          </p>
          <h1 className="font-inter mx-auto max-w-2xl px-6 text-2xl text-gray-300">
            We ensure maximum returns and investments for our stakeholders at
            Coin Spectrum Incorporation. Build your portfolio with confidence
            knowing that your investments are in capable hands. Join our
            community of investors and experience the power of smart investing.
          </h1>
          <Link href={"/dashboard"} title="" role="button" className="mx-auto">
            <ShineBorder
              className="text-center text-sm font-bold  capitalize md:text-lg"
              color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            >
              Invest Now
            </ShineBorder>
          </Link>
        </div>
      </motion.div>
    </ImagesSlider>
  );
}

export default ImagesSliderDemo;
