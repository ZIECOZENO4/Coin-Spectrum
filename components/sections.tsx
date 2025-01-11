'use client'
import React from 'react';
import Image from 'next/image';
import YouTubePreview from './YouTubePreview';

const getYouTubeId = (url: string): string | null => {
  const regExp = /^.*(?:youtu.be\/|v\/|e\/|u\/\w+\/|embed\/|v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[1];
};

interface SectionProps {
  title: string;
  description: string;
  buttonText1: string;
  buttonText2: string;
  imageUrl: string;
  reverse: boolean;
  link1: string;
  link2: string;
}

const HeroSection: React.FC<SectionProps> = ({
  title,
  description,
  buttonText1,
  buttonText2,
  imageUrl,
  reverse,
  link1,
  link2,
}) => {
  const isYouTube = imageUrl.includes('youtu');
  const videoId = isYouTube ? getYouTubeId(imageUrl) : null;

  return (
    <div className={`flex ${reverse ? 'flex-col md:flex-row-reverse' : 'md:flex-row flex-col'} w-full gap-8 p-6`}>
      <div className="flex-1">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-6">{description}</p>
        <div className="flex gap-4">
          <a href={link1} className="btn">{buttonText1}</a>
          <a href={link2} className="btn">{buttonText2}</a>
        </div>
      </div>
      <div className="flex-1">
        {isYouTube && videoId ? (
          <YouTubePreview videoId={videoId} />
        ) : (
          <Image
            src={imageUrl}
            alt={title}
            width={1280}
            height={720}
            className="w-full h-full object-cover rounded-lg"
          />
        )}
      </div>
    </div>
  );
};

export default HeroSection;
