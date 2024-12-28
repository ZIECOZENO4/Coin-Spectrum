import React from "react";
import "./loader.css";
const Loader = ({ className }: { className: string }) => {
  return (
    <div className={className}>
      <div className="boxes">
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <div className="box">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
