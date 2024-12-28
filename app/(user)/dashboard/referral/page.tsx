// UserReferralDashboardWrapper.tsx
import React from "react";
import UserReferralDashboard from "./aside";

const UserReferralDashboardWrapper: React.FC = () => {
  return (
    <div className=" flex items-center justify-center w-full min-h-screen">
      <UserReferralDashboard />
    </div>
  );
};

export default UserReferralDashboardWrapper;
