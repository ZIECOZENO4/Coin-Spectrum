"use client"
import React, { useState } from "react";
import LatestTrades from "./history";
import TradingInterface from "./tradeform";
import TradingViewWidget2 from "./TradingViewChart";
import TradingViewSymbolInfo from "./TradingViewSymbolInfo";
import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis";
import TradingViewFinancials from "./TradingViewFinancials";
import { TradesHistory } from "./TradesHistory";

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
          
          <div className="container w-screen md:w-auto py-10">
      <h1 className="md:text-2xl text-xl text-center font-bold mb-6">Trading History</h1>
      <TradesHistory />
    </div>
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
