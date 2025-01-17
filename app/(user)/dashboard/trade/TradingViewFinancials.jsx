"use client"
import React, { useEffect, useRef, memo } from 'react';

function TradingViewFinancials({ symbol }) {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;
    const formattedSymbol = symbol.includes('/') 
    ? `FX:${symbol.replace('/', '')}` 
    : `BINANCE:${symbol}USDT`;

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "isTransparent": false,
        "largeChartUrl": "",
        "displayMode": "regular",
        "autosize": true,
        "height": 1000,
        "colorTheme": "dark",
           "symbol": "${formattedSymbol}",
        "locale": "en",
        "onSymbolNotFound": "onSymbolNotFound"
      }`;
    container.current.appendChild(script);

    window.onSymbolNotFound = () => {
      const fallbackSymbol = "COINBASE:BTCUSD";
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-financials.js";
      fallbackScript.type = "text/javascript";
      fallbackScript.async = true;
      fallbackScript.innerHTML = `
        {
          "isTransparent": false,
          "largeChartUrl": "",
          "displayMode": "regular",
          "autosize": true,
          "height": 1000,
          "colorTheme": "dark",
          "symbol": "COINBASE:BTCUSD",
          "locale": "en"
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
    <div className="tradingview-widget-container-financial" ref={container}>
      <div className="tradingview-widget-container__widget-financial"></div>
      <div className="tradingview-widget-copyright-financial">
      </div>
    </div>
  );
}

export default memo(TradingViewFinancials);
