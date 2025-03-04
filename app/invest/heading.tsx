import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";

export function InvestHeading() {
  return (
    <BackgroundBeamsWithCollision>
      <h2 className="text-xl relative z-20 md:text-4xl font-bold text-center text-black dark:text-white font-sans tracking-tight">
        What&apos;s are you investing on?{" "}
        <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_1px_3px_rgba(27,_37,_80,_0.14))]">
          <div className="absolute left-0 top-[1px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-yellow-200 via-yellow-300 to-yellow-600 [text-shadow:0_0_rgba(0,0,0,0.1)]">
            <span className="">Lets check it out.</span>
          </div>
          <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-yellow-200 via-yellow-300 to-yellow-600 py-4">
            <span className="">Lets check it out.</span>
          </div>
        </div>
      </h2>
    </BackgroundBeamsWithCollision>
  );
}
