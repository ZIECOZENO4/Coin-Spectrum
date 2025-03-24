"use client"
import Link from 'next/link';
import React, { useEffect, useState } from 'react';


const NewsPage = () => {

  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-timeline.js';
    script.async = true;
    script.innerHTML = JSON.stringify({
      "feedMode": "all_symbols",
      "isTransparent": false,
      "displayMode": "regular",
      "autosize": true,
      "height": "3000",
      "width": "100%",
      "colorTheme": "dark",
      "locale": "en"
    });

    const widgetContainer = document.querySelector('.tradingview-widget-container__widget12');
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
      <div className="tradingview-widget-container1 py-2">
        <div className="tradingview-widget-container__widget12"></div>
        <div className="tradingview-widget-copyright123"></div>
      </div>
  );
};

export default NewsPage;
