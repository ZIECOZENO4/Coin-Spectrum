import React from 'react'
import LatestTrades from '../history'
import TradingExperts from './trader-content'
import { UserCopyTrades } from './UserCopyTrades'

const CopyTrade = () => {
  return (
    <div><TradingExperts />
  <div className="container mx-auto py-10">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="md:text-2xl text-xl text-center font-bold">Copy Trading History</h1>
        </div>
        <UserCopyTrades />
      </div>
    </div>
    </div>
  )
}

export default CopyTrade