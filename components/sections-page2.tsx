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
  },
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
    imageUrl: "/m8.jpg",
    reverse: false,
    link1: "/invest",
    link2: "/dashboard",
  },
  {
    title: "Best Trading and Broker Platform",
    description:
      "Coin Spectrum has been recognized by leading financial publications and platforms for our innovative approach to investment. Our technology and commitment to providing high returns have been featured globally, reinforcing our position as a trusted trading platform. Learn more about our achievements and how we can help you succeed.",
    buttonText1: "View Chart",
    buttonText2: "Start Trading",
    imageUrl: "/m2.jpg",
    reverse: true,
    link1: "/trades",
    link2: "/dashboard",
  },
  {
    title: "Flexible Investment Plans",
    description:
      "Coin Spectrum offers a variety of flexible investment plans to suit your needs. Whether you're looking for short-term gains or long-term growth, our platform has a plan that's right for you. Explore our investment options and choose the plan that aligns with your financial goals. Start investing today and watch your wealth grow.",
    buttonText1: "Explore Plans",
    buttonText2: "Get Started",
    imageUrl: "/m7.jpg",
    reverse: false,
    link1: "/invest",
    link2: "/dashboard",
  },
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
