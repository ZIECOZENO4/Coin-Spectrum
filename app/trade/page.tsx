import React from 'react'
import Statistic from './statistics'
import AnimatedHero from './introduction'
import FeaturesGrid from './listcontent'
import PlatformSection from './list2'
import Footer from '@/components/Footer'
import TradingOptions from './list3'
import TradedAssets from './list4'
import TradingStats from './stats'
import TradingViewWidget from './Chart'
import Blog1 from '@/components/blog1'
import TradingViewScreenerWidget from './market'
const TradePage = () => {
  return (
    <div>
        <div className="relative w-full h-[500px] overflow-hidden">
    <div className="absolute inset-0 filter blur-sm">
      <Statistic />
    </div>
    <div className="absolute inset-y-0 left-0 w-full md:w-1/3 bg-black bg-opacity-70 flex flex-col justify-center items-start p-8">
      <h2 className="text-3xl font-bold text-white mb-4">Forex Cross Rates</h2>
      <p className="text-white mb-6">Stay updated with real-time forex cross rates for major currency pairs.</p>
      <button className="bg-[#FFD700] text-black font-bold py-2 px-4 rounded hover:bg-yellow-600 transition duration-300">
        Learn More
      </button>
    </div>
  </div>
  <TradingStats />
  <AnimatedHero />
  <FeaturesGrid />
  <PlatformSection />
  <TradedAssets />
  <TradingOptions />
  <TradingViewWidget />
  <TradingViewScreenerWidget />
  <div className="div">
        <Blog1 />
      </div>
  <div className="div">
    <Footer />
  </div>
  </div>
  )
}

export default TradePage