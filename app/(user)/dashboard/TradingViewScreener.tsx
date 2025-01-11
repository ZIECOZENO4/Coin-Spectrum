'use client'
import { useEffect, useRef, memo } from 'react';

const TradingViewScreener = () => {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.type = 'text/javascript';
    script.async = true;
    script.innerHTML = `
      {
       "autosize": true,
         "height": "800",
        "defaultColumn": "overview",
        "screener_type": "crypto_mkt",
        "displayCurrency": "BTC",
        "colorTheme": "dark",
        "locale": "en"
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
    <div className="tradingview-widget-container400" ref={container}>
      <div className="tradingview-widget-container__widget400"></div>
      <div className="tradingview-widget-copyright400">
     
      </div>
    </div>
  );
};

export default memo(TradingViewScreener);
