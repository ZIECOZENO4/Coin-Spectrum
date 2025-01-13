'use client'
import React, { useEffect, useRef, memo } from 'react';

function TradingViewSymbolInfo() {
  const container = useRef();

  useEffect(() => {
    if (!container.current) return;

    // const formattedSymbol = `${symbol}`;
    const formattedSymbol = `BITSTAMP:BTCUSD`;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "symbol": "${formattedSymbol}",
        "width": "100%",
        "locale": "en",
        "colorTheme": "dark",
        "isTransparent": false,
        "onSymbolNotFound": "onSymbolNotFound"
      }`;
    container.current.appendChild(script);

    window.onSymbolNotFound = () => {
      const fallbackSymbol = "COINBASE:BTCUSD";
      const fallbackScript = document.createElement("script");
      fallbackScript.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-info.js";
      fallbackScript.type = "text/javascript";
      fallbackScript.async = true;
      fallbackScript.innerHTML = `
        {
          "symbol": "${fallbackSymbol}",
          "width": "100%",
          "locale": "en",
          "colorTheme": "dark",
          "isTransparent": false
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
    <div className="tradingview-widget-container-symbol" ref={container}>
      <div className="tradingview-widget-container__widget-symbol"></div>
      <div className="tradingview-widget-copyright-sysmbol">
      </div>
    </div>
  );
}

export default memo(TradingViewSymbolInfo);
