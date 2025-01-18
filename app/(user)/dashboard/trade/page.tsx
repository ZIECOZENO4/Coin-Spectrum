"use client"
import React, { useState } from "react";
import LatestTrades from "./history";
import TradingInterface from "./tradeform";
import TradingViewWidget2 from "./TradingViewChart";
import TradingViewSymbolInfo from "./TradingViewSymbolInfo";
import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis";
import TradingViewFinancials from "./TradingViewFinancials";

const TradePage = () => {
  const [selectedSymbol, setSelectedSymbol] = useState("EUR/USD");

  return (
    <div>
      <div className="">
        <div className="">
          <div className="">
            <TradingViewWidget2 symbol={selectedSymbol} />
          </div>
          <TradingInterface 
            selectedPair={selectedSymbol} 
            onSymbolChange={setSelectedSymbol} 
          />
          {/* <LatestTrades /> */}
          <div className="">
            <TradingViewTechnicalAnalysis symbol={selectedSymbol} />
          </div>
          <div className="">
            <TradingViewFinancials symbol={selectedSymbol} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradePage;
