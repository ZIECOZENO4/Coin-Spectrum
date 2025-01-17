'use client'
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget2({ symbol }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // Format the symbol appropriately
    const formattedSymbol = symbol.includes('/') 
      ? `FX:${symbol.replace('/', '')}` 
      : `BINANCE:${symbol}USDT`;
    
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "autosize": true,
        "height": "600",
        "symbol": "${formattedSymbol}",
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
        "watchlist": ["FX:EURUSD"],
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
    
    container.current.innerHTML = '';
    container.current.appendChild(script);

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, [symbol]);

  return (
    <div className="flex flex-col">
      <div className="tradingview-widget-container2 h-[220vh] w-[100vw]" ref={container}>
        <div className="tradingview-widget-container__widget2 h-[220vh] w-[100vw]"></div>
        <div className="tradingview-widget-copyright"></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget2);
