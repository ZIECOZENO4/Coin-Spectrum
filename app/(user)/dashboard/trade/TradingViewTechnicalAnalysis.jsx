"use client"
import React, { useEffect, useRef, memo } from 'react';

function TradingViewTechnicalAnalysis({ symbol }) {
  const container = useRef();
  const formattedSymbol = symbol.includes('/') 
  ? `FX:${symbol.replace('/', '')}` 
  : `BINANCE:${symbol}USDT`;

  useEffect(() => {
    if (!container.current) return;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
        "width": "100%",
        "isTransparent": false,
        "height": "600",
            "symbol": "${formattedSymbol}",
        "showIntervalTabs": true,
        "displayMode": "single",
        "locale": "en",
        "colorTheme": "dark",
        "onSymbolNotFound": "onSymbolNotFound"
      }`;
    container.current.appendChild(script);

    window.onSymbolNotFound = () => {
      const fallbackSymbol = "COINBASE:BTCUSD";
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
      fallbackScript.type = "text/javascript";
      fallbackScript.async = true;
      fallbackScript.innerHTML = `
        {
          "interval": "1m",
          "autosize": true,
          "isTransparent": false,
          "height": "600",
             "symbol": "${formattedSymbol}",
          "showIntervalTabs": true,
          "displayMode": "single",
          "locale": "en",
          "colorTheme": "dark"
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
    <div className="tradingview-widget-container-Analysis" ref={container}>
      <div className="tradingview-widget-container__widget-Analysis"></div>
      <div className="tradingview-widget-copyright-Analysis">
      </div>
    </div>
  );
}

export default memo(TradingViewTechnicalAnalysis);
