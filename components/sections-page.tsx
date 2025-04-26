import React from "react";
import HeroSection from "./sections";
import { MotionDiv } from "./ui/animateOnEnter";

const sectionsData = [
  {
    title: "Maximize Your Earnings with Coin Spectrum",
    description:
      "At Coin Spectrum, we offer investment opportunities that maximize your earnings. Our advanced algorithms and expert analysis ensure that your investments are strategically placed for optimal growth. Whether you're a seasoned investor or just starting out, our platform is designed to help you achieve your financial goals. Discover how you can grow your wealth with us.",
    buttonText1: "Discover",
    buttonText2: "Join Now",
    imageUrl: "/m9.jpg",
    reverse: true,
    link1: "/features",
    link2: "/dashboard",
  },
  {
    title: "Secure and Insured Investments",
    description:
      "Your security is our priority. Coin Spectrum provides insured investment options, giving you peace of mind as you grow your wealth. Our platform is audited by top security firms to ensure the highest standards of safety and reliability. Join a community that values your security and trust as much as you do.",
    buttonText1: "Our Security",
    buttonText2: "Start Investing",
    imageUrl: "/uou.jpg",
    reverse: false,
    link1: "/dashboard/deposit",
    link2: "/dashboard",
  },
  {
    title: "Best Trading and Broker Platform",
    description:
      "Coin Spectrum has been recognized by leading financial publications and platforms for our innovative approach to investment. Our technology and commitment to providing high returns have been featured globally, reinforcing our position as a trusted trading platform. Learn more about our achievements and how we can help you succeed.",
    buttonText1: "View Chart",
    buttonText2: "Start Trading",
    imageUrl: "/tr1.jpg",
    reverse: true,
    link1: "/dashboard/trade",
    link2: "/dashboard",
  },
  {
    title: "Flexible Investment Plans",
    description:
      "Coin Spectrum offers a variety of flexible investment plans to suit your needs. Whether you're looking for short-term gains or long-term growth, our platform has a plan that's right for you. Explore our investment options and choose the plan that aligns with your financial goals. Start investing today and watch your wealth grow.",
    buttonText1: "Explore Plans",
    buttonText2: "Get Started",
    imageUrl: "/cd.jpg",
    reverse: false,
    link1: "/dashboard/invest",
    link2: "/dashboard",
  }

 
];

const Section: React.FC = () => {
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

export default Section;
