"use client";
import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface ImageCarouselProps {
  images: string[];
  width?: number;
  height?: number;
}

export function ImageCarousel({
  images,
  width = 650,
  height = 650,
}: ImageCarouselProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  );

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full mx-auto"
      orientation="horizontal"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent className="flex flex-row   rounded-xl object-cover w-full h-auto justify-center mx-auto items-center">
        {images.map((image, index) => (
          <CarouselItem key={index}>
            <Image
              key={index}
              src={image}
              alt={`Image ${index + 1}`}
              width={width}
              height={height}
              className=""
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
}
