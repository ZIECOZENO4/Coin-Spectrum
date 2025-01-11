'use client'
import React, { useEffect, useRef, memo } from 'react';

function TradingViewWidget3() {
  const container = useRef();

  useEffect(
    () => {
      const script = document.createElement("script");
      script.src = "https://s3.tradingview.com/external-embedding/embed-widget-crypto-coins-heatmap.js";
      script.type = "text/javascript";
      script.async = true;
      script.innerHTML = `
        {
          "dataSource": "Crypto",
          "blockSize": "market_cap_calc",
          "blockColor": "change",
          "locale": "en",
          "symbolUrl": "",
          "colorTheme": "dark",
          "hasTopBar": false,
          "isDataSetEnabled": false,
          "isZoomEnabled": true,
          "hasSymbolTooltip": true,
          "isMonoSize": false,
         "autosize": true,
         "height": "800"
        }`;
      container.current.appendChild(script);
    },
    []
  );

  return (
    <div className="tradingview-widget-container200" ref={container}>
      <div className="tradingview-widget-container__widget200"></div>
      <div className="tradingview-widget-copyright200"></div>
    </div>
  );
}

export default memo(TradingViewWidget3);
