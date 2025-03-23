// "use client"
// import React, { useState } from "react";
// import LatestTrades from "./history";
// import TradingInterface from "./tradeform";
// import TradingViewWidget2 from "./TradingViewChart";
// import TradingViewSymbolInfo from "./TradingViewSymbolInfo";
// import TradingViewTechnicalAnalysis from "./TradingViewTechnicalAnalysis";
// import TradingViewFinancials from "./TradingViewFinancials";
// import { TradesHistory } from "./TradesHistory";

// const TradePage = () => {
//   const [selectedSymbol, setSelectedSymbol] = useState("EUR/USD");

//   return (
//     <div>
//       <div className="">
//         <div className="">
//           <div className="">
//             <TradingViewWidget2 symbol={selectedSymbol} />
//           </div>
//           <TradingInterface 
//             selectedPair={selectedSymbol} 
//             onSymbolChange={setSelectedSymbol} 
//           />
          
//           <div className="container w-screen md:w-auto py-10">
//       <h1 className="md:text-2xl text-xl text-center font-bold mb-6">Trading History</h1>
//       <TradesHistory />
//     </div>
//           <div className="">
//             <TradingViewTechnicalAnalysis symbol={selectedSymbol} />
//           </div>
//           <div className="">
//             <TradingViewFinancials symbol={selectedSymbol} />
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TradePage;


"use client"
import React, { useState, useEffect } from "react";

interface TradingInterfaceProps {
  selectedPair: string;
  onSymbolChange: (symbol: string) => void;
}

const TradingInterface: React.FC<TradingInterfaceProps> = ({ selectedPair, onSymbolChange }) => {
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const [amount, setAmount] = useState("");
  const [leverage, setLeverage] = useState("1:50");
  const [expiry, setExpiry] = useState("5m");
  
  const leverageOptions = {
    "EUR/USD": ["1:50", "1:100", "1:200"],
    "USD/JPY": ["1:30", "1:50", "1:100"],
    "GBP/USD": ["1:50", "1:100", "1:200"],
    default: ["1:30", "1:50", "1:100"]
  };

  useEffect(() => {
    // Reset leverage when pair changes
    setLeverage(leverageOptions[selectedPair as keyof typeof leverageOptions]?.[0] || leverageOptions.default[0]);
  }, [selectedPair]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Implement your trade submission logic here
    console.log({
      symbol: selectedPair,
      type: tradeType,
      amount: parseFloat(amount),
      leverage,
      expiry
    });

    // Reset form fields after submission
    setAmount("");
    setLeverage(leverageOptions[selectedPair as keyof typeof leverageOptions]?.[0] || leverageOptions.default[0]);
    setExpiry("5m");
  };

  return (
    <div className="trading-interface">
      <form onSubmit={handleSubmit} className="trade-form">
        <div className="form-group">
          <label>Symbol</label>
          <select 
            value={selectedPair}
            onChange={(e) => onSymbolChange(e.target.value)}
            className="form-control"
          >
            <option value="EUR/USD">EUR/USD</option>
            <option value="USD/JPY">USD/JPY</option>
            <option value="GBP/USD">GBP/USD</option>
          </select>
        </div>

        <div className="form-group">
          <label>Type</label>
          <div className="trade-type-buttons">
            <button
              type="button"
              className={`buy-btn ${tradeType === "BUY" ? "active" : ""}`}
              onClick={() => setTradeType("BUY")}
            >
              BUY
            </button>
            <button
              type="button"
              className={`sell-btn ${tradeType === "SELL" ? "active" : ""}`}
              onClick={() => setTradeType("SELL")}
            >
              SELL
            </button>
          </div>
        </div>

        <div className="form-group">
          <label>Amount ($)</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="form-control"
            placeholder="Enter amount"
            step="0.01"
            min="0"
          />
        </div>

        <div className="form-group">
          <label>Leverage</label>
          <select
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="form-control"
          >
            {(leverageOptions[selectedPair as keyof typeof leverageOptions] || leverageOptions.default).map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Expiry</label>
          <select
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="form-control"
          >
            <option value="1m">1 Minute</option>
            <option value="5m">5 Minutes</option>
            <option value="15m">15 Minutes</option>
            <option value="30m">30 Minutes</option>
            <option value="1h">1 Hour</option>
            <option value="4h">4 Hours</option>
            <option value="1d">1 Day</option>
          </select>
        </div>

        <button type="submit" className="submit-btn">
          Confirm {tradeType}
        </button>
      </form>
    </div>
  );
};

export default TradingInterface;
