"use client"
import React, { useEffect, useRef, memo } from 'react';
import Statistic from "./statistics"
function TradingViewWidget() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "autosize": true,
           "height": "1500",
          "symbol": "BINANCE:BTCUSDT",
          "interval": "D",
          "timezone": "Etc/UTC",
          "theme": "dark",
          "style": "1",
          "locale": "en",
          "enable_publishing": true,
          "backgroundColor": "rgba(0, 0, 0, 1)",
          "gridColor": "rgba(66, 66, 66, 0.06)",
          "withdateranges": true,
          "hide_side_toolbar": false,
          "allow_symbol_change": true,
          "watchlist": [
            "FX:EURUSD"
          ],
          "details": true,
          "hotlist": true,
          "calendar": false,
          "studies": [
            "STD;Accumulation_Distribution",
            "STD;Advance_Decline_Ratio_Bars",
            "STD;Balance%1of%1Power"
          ],
          "support_host": "https://www.tradingview.com"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="flex flex-col mt-4 my-8 md:my-11">
         <h2 className=' text-4xl font-bold py-2  text-[#FFD700] font-serif text-center md:text-[60px]'>COIN SPECTRUM OFFERS THE BEST TRADING TOOLS.</h2>
    <div className="tradingview-widget-container  w-[90vw]" ref={container} style={{ height: "300%", width: "90%" }}>
      <div className="tradingview-widget-container__widget   w-[90vw]" style={{ height: "calc(300% - 32px)", width: "90%" }}></div>
      <div className="tradingview-widget-copyright" ></div>
    </div>
    <Statistic />
    </div>

  );
}

export default memo(TradingViewWidget);
