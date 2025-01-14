import React from 'react'
import { InvestmentImages } from './ThreeDCardDemo'
import { InvestHeading } from './heading'
import Footer from '@/components/Footer'
import Videos from './videos'
import Plan from './plans'
import Section from '@/components/sections-page'
import { FocusCardsDemo } from './wheretobuybtc'
import { SpotlightPreview } from './spot'

const InvestPage = () => {
  return (
    <div>
          <InvestHeading />
        <InvestmentImages />
     <SpotlightPreview />
        <Plan />
        <div className="mt-10">
                <Section />
              </div>
      
        <div className="div">
    <Footer />
  </div>
    </div>
  )
}

export default InvestPage