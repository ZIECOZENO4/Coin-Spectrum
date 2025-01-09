import React from 'react'
import PageContent from './content'
import Footer from '@/components/Footer'
import WhyUs from './whyus'
import TeamCard from './team'

const TestminalsPage = () => {
  return (
    <div>
      <PageContent />
      <WhyUs />
      <TeamCard />
      <div className="div">
    <Footer />
  </div>
    </div>
  )
}

export default TestminalsPage