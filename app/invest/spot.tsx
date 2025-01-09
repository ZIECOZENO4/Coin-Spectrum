import React from "react";
import { cn } from "@/lib/utils";
import { FocusCardsDemo } from "./wheretobuybtc";
import { Spotlight } from "@/components/ui/Spotlight"; 

export function SpotlightPreview() {
  return (
    <div className="h-auto w-full rounded-md flex flex-col p-2 md:p-4 md:items-center gap-4 md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 ">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 bg-opacity-50">
          WHERE TO BUY BITCON (BTC)
        </h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        Coin Spectrum provides a list of successful, verified and most used platform, where you can buy or sell your BTC. Check the options below.
        </p>
      </div>
      <FocusCardsDemo />
    </div>
  );
}
