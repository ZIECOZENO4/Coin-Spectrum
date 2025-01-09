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
    title: "Make things float in air",
    description: "Hover over this card to unleash the power of CSS perspective",
    imageSrc: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "Try now →",
    linkHref: "https://twitter.com/mannupaaji",
    buttonText: "Sign up"
  },
  {
    title: "Explore the cosmos",
    description: "Discover the wonders of the universe with our interactive space tours",
    imageSrc: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2662&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "Start exploring →",
    linkHref: "https://nasa.gov",
    buttonText: "Book tour"
  },
  {
    title: "Master the art of cooking",
    description: "Learn culinary secrets from world-renowned chefs",
    imageSrc: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "View recipes →",
    linkHref: "https://foodnetwork.com",
    buttonText: "Enroll now"
  },
  {
    title: "Dive into the ocean",
    description: "Explore the depths of the sea and discover marine life",
    imageSrc: "https://images.unsplash.com/photo-1682687982501-1e58ab814714?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "Start diving →",
    linkHref: "https://oceanconservancy.org",
    buttonText: "Book dive"
  },
  {
    title: "Capture the moment",
    description: "Learn photography techniques from professional photographers",
    imageSrc: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "Start shooting →",
    linkHref: "https://nationalgeographic.com",
    buttonText: "Join workshop"
  },
  {
    title: "Code your future",
    description: "Build the skills you need for a successful career in tech",
    imageSrc: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    linkText: "Start coding →",
    linkHref: "https://github.com",
    buttonText: "Enroll now"
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
