// UserReferralDashboard.tsx
"use client";
import React, { useState, useEffect } from "react";
import { FaUser, FaCopy, FaCheck } from "react-icons/fa";
import { format } from "date-fns";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { useReferralData } from "@/lib/tenstack-hooks/useRefferals";

const UserReferralDashboard: React.FC = () => {
  const { data: referralData } = useReferralData();

  // Use the useCopyToClipboard hook
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [hasCopiedText, setHasCopiedText] = useState(false);

  return (
    <div className="bg-neutral-950 max-w-[40rem] w-full  p-6 rounded-lg shadow-md">
      <h2 className="dark:text-white text-md mb-6 font-bold text-gray-800">
        User Referral Dashboard
      </h2>
      <div className="md:flex-row flex flex-col gap-6">
        {/* Referral Summary */}
        <div className="flex-1 p-6 text-white bg-orange-500 rounded-lg">
          <h3 className="mb-2 text-sm font-bold">Referral Summary</h3>
          <p className="text-3xl font-bold">{referralData.referrals.length}</p>
          <p className="text-lg">Total Referrals</p>
        </div>

        {/* Referred By */}
        {referralData.referredBy && (
          <div className="flex-1 p-6 text-white bg-green-500 rounded-lg">
            <h3 className="mb-2 text-sm font-bold">Referred By</h3>
            <div className="flex items-center space-x-4">
              <FaUser className="text-md text-white" />
              <div>
                <p className="text-lg font-bold">
                  {referralData.referredBy.name}
                </p>
                <p className="text-base">{referralData.referredBy.email}</p>
                <p className="text-sm">
                  Referred on{" "}
                  {format(referralData.referredBy.referralDate, "MMMM d, yyyy")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Referral Explanation */}
      <div className="p-4 mt-4 bg-orange-900 rounded-lg">
        <h3 className="dark:text-white mb-4 text-sm font-bold text-gray-800">
          How Referrals Work
        </h3>
        <p className="dark:text-gray-300 text-base text-gray-600">
          Earn $300 for each valid referral! When someone you refer purchases an
          investment plan using your unique referral link, you will receive a
          N300 bonus. Share your link with friends and family to maximize your
          earnings potential.
        </p>
      </div>

      {/* Referral Link */}
      <div className="animate-pulse p-4 mt-4 bg-orange-900 rounded-lg">
        <h3 className="dark:text-white mb-4 text-sm font-bold text-gray-800">
          Your Referral Link
        </h3>
        <div className="flex flex-row items-center space-x-4">
          <pre className="dark:text-gray-300 text-xs text-gray-600">
            {referralData.referralLink}
          </pre>
          <button
            disabled={!!copiedText}
            className="link"
            onClick={async () =>
              await copyToClipboard(referralData.referralLink)
            }
          >
            {copiedText ? (
              <FaCheck className="text-xs text-green-500" />
            ) : (
              <FaCopy className="dark:text-gray-400 text-xs text-gray-500" />
            )}
          </button>
        </div>
      </div>

      {/* User Referrals */}
      <div className="bg-neutral-900 p-6 mt-8 rounded-lg">
        <h3 className="dark:text-white mb-4 text-sm font-bold text-gray-800">
          User Referrals
        </h3>
        {referralData.referrals.map((referral) => (
          <div
            key={referral.id}
            className="ring-1 ring-orange-300 flex items-center justify-between p-4 mb-4 rounded-md"
          >
            <div className="flex items-center space-x-4">
              <FaUser className="dark:text-gray-400 text-sm text-gray-500" />
              <div>
                <p className="dark:text-white text-lg font-bold text-gray-800">
                  {referral.name}
                </p>
                <p className="dark:text-gray-300 text-base text-gray-600">
                  {referral.email}
                </p>
                <p className="dark:text-gray-400 text-sm text-gray-500">
                  Referred on {format(referral.referralDate, "MMMM d, yyyy")}
                </p>
              </div>
            </div>
            <div>
              {referral.hasInvestment ? (
                <span className="px-3 py-1 text-sm text-white bg-green-500 rounded-full">
                  Valid Referral
                </span>
              ) : (
                <span className="px-3 py-1 text-sm text-white bg-red-500 rounded-full">
                  Invalid Referral
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserReferralDashboard;
