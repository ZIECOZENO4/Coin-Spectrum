// import React from "react";
// import RealismButton from "./realism-button";
// import { ImageCarousel } from "./imageCarousel";
// import ShineBorder from "./ui/shine-border-button";

// const image = [
//   "https://farmgrid.org/wp-content/uploads/2019/05/corn-field-1935_1280.jpg",
//   "https://farmgrid.org/wp-content/uploads/2019/06/tomatoes-1280859_1280.jpg",
//   "https://farmgrid.org/wp-content/uploads/2019/06/cassava-leaves-1676161_1920.jpg",
//   "https://farmgrid.org/wp-content/uploads/2019/06/pig-4111895_1280.jpg",
//   "https://farmgrid.org/wp-content/uploads/2019/06/Maize_farm-Tanzania.jpg",
// ];

// const DigitalSolaceInvestment: React.FC = () => {
//   return (
//     <section className="bg-neutral-950 flex flex-col justify-center items-center pt-12 sm:pt-16">
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         <div className="text-center flex flex-col items-center justify-center gap-4">
//           <p className="mx-auto mb-4 max-w-4xl bg-gradient-to-r from-emerald-500 to-lime-600 bg-clip-text text-4xl font-bold leading-tight text-transparent sm:text-5xl sm:leading-tight lg:text-6xl lg:leading-tight">
//             Coin Spectrum Investment Platform
//           </p>
//           <h1 className="font-inter mx-auto max-w-2xl px-6 text-lg text-gray-300">
//             We ensure maximum returns and investments for our stakeholders at
//             Coin Spectrum Incorporation. Build your portfolio with confidence
//             knowing that your investments are in capable hands. Join our
//             community of investors and experience the power of smart investing.
//           </h1>
//           <a href="#" title="" role="button" className="mx-auto">
//             <ShineBorder
//               className="text-center text-sm font-bold  capitalize md:text-lg"
//               color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
//             >
//               Invest Now
//             </ShineBorder>
//           </a>
//         </div>
//       </div>
//       <div className="flex justify-center items-center w-full bg-neutral-950 mt-4 md:mt-8">
//         <div className="w-full max-w-2xl">
//           <ImageCarousel images={image} />
//         </div>
//       </div>
//     </section>
//   );
// };

// export default DigitalSolaceInvestment;

"use client";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
import ShineBorder from "./ui/shine-border-button";
import { ImagesSlider } from "./ui/image-slider";
import Link from "next/link";
import { DynamicButton } from "./dynamic-button";

function ImagesSliderDemo() {
  const images = [
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero7.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero6.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero5.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero3.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero2.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/hero1.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/favi.jpg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/Solace-8.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/Solace-6.jpeg",
    "https://uoppdgbycojkpcadszya.supabase.co/storage/v1/object/public/hero/Solace-2.jpg",

  
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
          <h1 className="font-inter mx-auto max-w-2xl px-6 text-lg text-gray-300">
            We ensure maximum returns and investments for our stakeholders at
            Coin Spectrum Incorporation. Build your portfolio with confidence
            knowing that your investments are in capable hands. Join our
            community of investors and experience the power of smart investing.
          </h1>
          {/* <Link href={"/dashboard"} title="" role="button" className="mx-auto">
            <ShineBorder
              className="text-center text-sm font-bold  capitalize md:text-lg"
              color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
            >
              Invest Now
            </ShineBorder>
          </Link> */}
          <Suspense>
            <DynamicButton />
          </Suspense>
        </div>
      </motion.div>
    </ImagesSlider>
  );
}

export default ImagesSliderDemo;
