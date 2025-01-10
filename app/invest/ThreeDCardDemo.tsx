"use client";

import Image from "next/image";
import React from "react";
import { CardBody, CardContainer, CardItem } from "@/components/ui/3d-card";
import Link from "next/link";

interface CardData {
    title: string;
    description: string;
    imageSrc: string;
    linkText: string;
    linkHref: string;
    buttonText: string;
  }
  
const cardData = [
  {
    title: "Why Invest in Forex and Crypto Assets",
    description: "Your no 1 broker platform, completing around 2000 trades per day.",
    imageSrc: "/cs4.jpg",
    linkText: "Learn More →",
    linkHref: "/dashboard/investment",
    buttonText: "Inest Now"
  },
  {
    title: "Why Invest in Real Estate",
    description: "Coin Spectrum is one of the biggest real estate company in the world.",
    imageSrc: "/cs1.jpg",
    linkText: "Start exploring →",
    linkHref: "/dashboard/investment",
    buttonText: "Start Investing"
  },
  {
    title: "Why Invest in Stocks",
    description: "Invest on the stocks of Coin Spectrum as it high market value",
    imageSrc: "/cs2.jpg",
    linkText: "View Charts →",
    linkHref: "/dashboard/investment",
    buttonText: "Invest now"
  },
  {
    title: "Why Invest in Cannabis",
    description: "Coin Specturm is the world top pioneer for market in Cannabis",
    imageSrc: "/cs.jpg",
    linkText: "Learn More →",
    linkHref: "/dashboard/investment",
    buttonText: "Start investing"
  }
];

const InvestCard = ({ data }: { data: CardData }) => (
  <CardContainer className="inter-var">
    <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border  ">
      <CardItem
        translateZ="50"
        className="text-xl font-bold text-neutral-600 dark:text-white"
      >
        {data.title}
      </CardItem>
      <CardItem
        as="p"
        translateZ="60"
        className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
      >
        {data.description}
      </CardItem>
      <CardItem translateZ="100" className="w-full mt-4">
        <Image
          src={data.imageSrc}
          height="1000"
          width="1000"
          className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
          alt="thumbnail"
        />
      </CardItem>
      <div className="flex justify-between items-center mt-20">
        <CardItem
          translateZ={20}
          as={Link}
          href={data.linkHref}
          target="__blank"
          className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
        >
          {data.linkText}
        </CardItem>
        <CardItem
          translateZ={20}
          as="button"
          className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
        >
          {data.buttonText}
        </CardItem>
      </div>
    </CardBody>
  </CardContainer>
);

export function InvestmentImages() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
      {cardData.map((data, index) => (
        <InvestCard key={index} data={data} />
      ))}
    </div>
  );
}
