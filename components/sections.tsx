// components/HeroSection.tsx
import React from "react";
import Image from "next/image";
import Link from "next/link";
import ShineBorder from "./ui/shine-border-button";

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText1: string;
  buttonText2: string;
  imageUrl: string;
  reverse?: boolean;
  link1: string;
  link2: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  description,
  buttonText1,
  buttonText2,
  imageUrl,
  reverse = false,
  link1,
  link2,
}) => {
  return (
    <section className="body-font max-w-[950dvw] bg-neutral-950 text-gray-600 dark:bg-neutral-950 md:max-w-[80dvw]">
      <div
        className={`container mx-auto flex flex-col items-center gap-5  px-1  md:flex-row  ${
          reverse ? "md:flex-row-reverse " : "md:flex-row "
        }`}
      >
        <div className="mb-16 flex flex-col items-center text-center md:mb-0 md:w-1/2 md:items-start md:pr-16 md:text-left lg:flex-grow lg:pr-24">
          <h1 className="title-font mb-4 text-3xl font-medium text-transparent bg-clip-text bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-emerald-100 via-emerald-600 to-orange-500 sm:text-4xl">
            {title}
            <br className="hidden lg:inline-block" />
          </h1>
          <p className="mb-8 text-xs leading-relaxed text-gray-700 dark:text-gray-300 md:text-sm">
            {description}
          </p>
          <div className="flex gap-4 justify-center">
            <Link href={link1}>
              <ShineBorder
                className="text-center text-sm font-bold  capitalize md:text-lg"
                color={["#A07CFE", "#FE8FB5", "#FFBE7B"]}
              >
                {buttonText1}
              </ShineBorder>
            </Link>
            <Link href={link2}>
              <button className=" inline-flex rounded border-0 bg-green-500 px-3 py-4 text-sm text-gray-700 hover:bg-gray-200 focus:outline-none">
                {buttonText2}
              </button>
            </Link>
          </div>
        </div>
        <div className="w-5/6 md:w-1/2 lg:w-full lg:max-w-lg">
          <Image
            className="rounded-md  bg-inherit object-cover object-center"
            alt="hero"
            width={800}
            height={800}
            quality={70}
            src={imageUrl}
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;