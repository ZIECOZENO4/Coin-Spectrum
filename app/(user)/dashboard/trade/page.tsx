import React from 'react'
import LatestTrades from './history'
import TradingInterface from './tradeform'
import TradingViewWidget2 from './TradingViewChart';
import TradingViewSymbolInfo from "./TradingViewSymbolInfo";
import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis"
import TradingViewFinancials from "./TradingViewFinancials"
const TradePage = () => {
  return (
    <div>
        <div className="">
        <div className="">
         
          <div className="">
          <TradingViewWidget2  />
          </div>
          <TradingInterface />
          <LatestTrades />
          <div className=""> 
          <TradingViewTechnicalAnalysis />
          </div>
         <div className=""> 
          <TradingViewFinancials />
          </div>
        </div>
      </div>
        </div>
  )
}

export default TradePage