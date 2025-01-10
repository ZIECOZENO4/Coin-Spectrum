import React from 'react'
import PageContent from './content'
import Footer from '@/components/Footer'
import WhyUs from './whyus'
import TeamCard from './team'
import Section3 from '@/components/sections-page3'

const TestminalsPage = () => {
  return (
    <div>
      <PageContent />
      <WhyUs />
      <Section3 />
      <TeamCard />
      <div className="div">
    <Footer />
  </div>
    </div>
  )
}

export default TestminalsPage