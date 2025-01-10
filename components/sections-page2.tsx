import React from "react";
import HeroSection from "./sections";
import { MotionDiv } from "./ui/animateOnEnter";

const sectionsData = [
  {
    title: "Welcome to Coin Spectrum trading and Investment Platform",
    description:
      "Join the Coin Spectrum Investment Platform and unlock the potential for significant returns. By investing a small amount, you can access high-yield opportunities that were once only available to elite investors. Our platform leverages cutting-edge technology to provide secure, transparent, and profitable investment options. Take the first step towards financial independence with Coin Spectrum.",
    buttonText1: "Learn More",
    buttonText2: "Explore Now",
    imageUrl: "https://youtu.be/41JCpzvnn_0?si=Hqku2vk1zYPuWzfS",
    reverse: false,
    link1: "/dashboard",
    link2: "/dashboard",
  }
];

const Section2: React.FC = () => {
  return (
    <div className="flex flex-col gap-4 items-center justify-center">
      {sectionsData.map((section, index) => (
        <MotionDiv key={index}>
          <HeroSection
            key={index}
            title={section.title}
            description={section.description}
            buttonText1={section.buttonText1}
            buttonText2={section.buttonText2}
            imageUrl={section.imageUrl}
            reverse={section.reverse}
            link1={section.link1}
            link2={section.link2}
          />
        </MotionDiv>
      ))}
    </div>
  );
};

export default Section2;
