'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import Dashboard from "@/components/dashboard/card";
import UserBalances from "@/components/dashboard/three-cards-2";
import { InvestmentDashboard } from "@/components/dashboard/three-cards";
import { SkeletonDemo } from "@/components/dashboard/skeleton";
import { Suspense, useEffect } from "react";
import NoData from "@/components/noData";
import StatsDashboard from "@/components/dashboard/accdetails";
import TradingViewWidget from './TradingViewWidget';
import TradingViewWidget2 from './TradingViewWidget2';
import TradingViewWidget3 from './TradingViewWidget3';
import TradingViewScreener from './TradingViewScreener';
import { ErrorBoundary } from 'react-error-boundary';
import Loader from "@/components/loader";
import Loading from "@/app/loading";
import ReferralCard from "@/components/dashboard/referral";
import TradingViewSymbolInfo from "./trade/TradingViewSymbolInfo";
import TradingViewFinancials from "./trade/TradingViewFinancials";
import { toast } from "sonner";
import { useAuth } from '@clerk/nextjs';


export default function Home() {
  const { userId, isLoaded } = useAuth();
  useEffect(() => {
    const ref = localStorage.getItem('referralId');


    if (ref) {
      toast.info('Checking referral status...');
      processReferral(ref);
    }
  }, []);
  
  const processReferral = async (ref: string) => {

    try {
      const response = await fetch('/api/referrals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referralId: ref }),
      });

      const data = await response.json();
  

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process referral');
      }

      localStorage.removeItem('referralId');
      toast.success('Referral processed successfully');

    } catch (error) {
      console.error('Referral processing error:', error);
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to process referral');
      }
    }
  };

 
  if (!isLoaded) {
    return <div className="text-center align-middle">Getting user info...</div>;
  }
  
  if (!userId) {
    return <NoData shortText="user is not authenticated" />;
  }
  
  return (
    <main className="w-full">
      <Suspense fallback={<SkeletonDemo />}>
        <div className="flex flex-col md:flex-row justify-center md:justify-between">
          <InvestmentDashboard userId={userId}/>
          <StatsDashboard userId={userId} />
        </div>
        <UserBalances />
        <div>
          <div className="">
            <div className="">
            </div>
          </div>
        </div>
      </Suspense>
    </main>
  );
}
