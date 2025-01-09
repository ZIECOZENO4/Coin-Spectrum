

"use client"
import React, { useEffect } from 'react';

const TradingViewScreenerWidget = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-screener.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "autosize": true,
           "height": "3000",
      "defaultColumn": "overview",
      "screener_type": "crypto_mkt",
      "displayCurrency": "USD",
      "colorTheme": "dark",
      "locale": "en"
    });

    const widgetContainer = document.querySelector('.tradingview-widget-container__widget2');
    if (widgetContainer) {
      widgetContainer.appendChild(script);
    }

    return () => {
      // Check if the script is still a child of the widgetContainer before removing it
      if (widgetContainer && script.parentNode === widgetContainer) {
        widgetContainer.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="tradingview-widget-container2">
      <div className="tradingview-widget-container__widget2"></div>
      <div className="tradingview-widget-copyright2">
    
      </div>
    </div>
  );
};

export default TradingViewScreenerWidget;
