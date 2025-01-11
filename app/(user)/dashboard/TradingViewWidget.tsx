'use client'
import { useEffect, useRef, memo } from "react";

const TradingViewWidget2 = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-technical-analysis.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = `
      {
        "interval": "1m",
      
        "isTransparent": false,
         "autosize": true,
         "height": "800",
        "symbol": "BITSTAMP:BTCUSD",
        "showIntervalTabs": true,
        "displayMode": "multiple",
        "locale": "en",
        "colorTheme": "dark"
      }`;

    if (container.current) {
      container.current.appendChild(script);
    }

    return () => {
      if (container.current) {
        container.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container101" ref={container}>
      <div className="tradingview-widget-container__widget101"></div>
      <div className="tradingview-widget-copyright101">
      </div>
    </div>
  );
};

export default memo(TradingViewWidget2);
