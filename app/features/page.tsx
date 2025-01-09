import React from 'react'
import FeaturesHero from './content'
import { AppleCardsCarouselDemo } from './list'
import { WorldMapDemo } from './allused'
import WhatWeDo from './whatwedo'
import Footer from '@/components/Footer'

const Features = () => {
  return (
    <div><FeaturesHero /> <AppleCardsCarouselDemo /> <WorldMapDemo /> <WhatWeDo />    <div className="div">
    <Footer />
  </div></div>
  )
}

export default Features