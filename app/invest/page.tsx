import React from 'react'
import { InvestmentImages } from './ThreeDCardDemo'
import { InvestHeading } from './heading'
import Footer from '@/components/Footer'
import Videos from './videos'
import Plan from './plans'
const InvestPage = () => {
  return (
    <div>
          <InvestHeading />
        <InvestmentImages />
        <Plan />
        <div className="px-4 md:px-8">
            <h1 className="text-3xl text-left font-serif font-bold mb-2 md:mb-4">Trending Videos</h1>
            <Videos />
        </div>
        <div className="div">
    <Footer />
  </div>
    </div>
  )
}

export default InvestPage