import React from "react";
import HeroSection from "./sections";
import { MotionDiv } from "./ui/animateOnEnter";

const sectionsData = [
  {
    title: "24/7 Customer Support",
    description:
      "At Coin Spectrum, we believe in providing exceptional customer service. Our dedicated support team is available 24/7 to assist you with any questions or concerns. We are here to ensure your investment journey is smooth and successful. Connect with us anytime and experience our commitment to your satisfaction.",
    buttonText1: "Contact Us",
    buttonText2: "Support Center",
    imageUrl: "/m78.jpg",
    reverse: true,
    link1: "/about",
    link2: "/dashboard/support",
  },
 
];

const Section3: React.FC = () => {
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

export default Section3;
