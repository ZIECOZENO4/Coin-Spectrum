'use client'
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget2() {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    const formattedSymbol = `BITSTAMP:BTCUSD`;
    
    // const formattedSymbol = `${symbol}`;

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
        "support_host": "https://www.tradingview.com",
        "onSymbolNotFound": "onSymbolNotFound"
      }`;
    container.current.appendChild(script);

    window.onSymbolNotFound = () => {
      const fallbackSymbol = "COINBASE:BTCUSD";
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
      fallbackScript.type = "text/javascript";
      fallbackScript.async = true;
      fallbackScript.innerHTML = `
        {
          "autosize": true,
          "height": "600",
          "symbol": "${fallbackSymbol}",
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
      container.current.innerHTML = '';
      container.current.appendChild(fallbackScript);
    };

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
      window.onSymbolNotFound = null;
    };
  });

  return (
    <div className="flex flex-col">
      <div className="tradingview-widget-container2 h-[220vh] w-[100vw]" ref={container} style={{ height: "300%", width: "100%" }}>
        <div className="tradingview-widget-container__widget2 h-[220vh] w-[100vw]" style={{ height: "calc(300% - 32px)", width: "100%" }}></div>
        <div className="tradingview-widget-copyright"></div>
      </div>
    </div>
  );
}

export default memo(TradingViewWidget2);
