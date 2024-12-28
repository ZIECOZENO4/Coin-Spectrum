"use client";
import React from "react";

interface DashboardCardProps {
  label: string;
  balance: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ label, balance }) => {
  return (
    <div className="relative w-[95vw]   xs:w-72 sm:w-80 md:w-80 h-40  bg-orange-500 rounded-lg overflow-hidden shadow-lg">
      <div
        className="absolute inset-0 bg-orange-600"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 50%, 50% 100%, 0 50%)" }}
      ></div>
      <div
        className="absolute bottom-0 left-0 right-0 bg-black text-white px-4 py-2"
        style={{ clipPath: "polygon(0 0, 100% 0, 85% 100%, 0 100%)" }}
      >
        <div className="flex justify-between">
          <span>{label}</span>
          <span></span>
        </div>
      </div>
      <div
        className="absolute top-12 left-4 px-4 py-2 text-white font-extrabold text-2xl bg-slate-800 rounded-full"
        style={{ width: "fit-content" }}
      >
        <h1 className="bg-[radial-gradient(ellipse_at_right,_var(--tw-gradient-stops))] from-green-300 via-indigo-300 to-purple-500 bg-clip-text text-transparent">
          {balance}
        </h1>
      </div>
    </div>
  );
};

export default DashboardCard;
