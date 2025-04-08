import React from 'react'
import './Trustpilot.css'

const Trustpilot = () => {
  return (
    <div className="trustpilot-container">
      <div 
        className="trustpilot-widget glow-on-hover" 
        data-locale="en-US" 
        data-template-id="56278e9abfbbba0bdcd568bc" 
        data-businessunit-id="67c77ae55c9b12b4b4d1085f" 
        data-style-height="52px" 
        data-style-width="100%"
      >
        <a 
          href="https://www.trustpilot.com/review/coinspectrum.net" 
          target="_blank" 
          rel="noopener"
          className="trustpilot-link"
        >
          Trustpilot
        </a>
      </div>
    </div>
  )
}

export default Trustpilot