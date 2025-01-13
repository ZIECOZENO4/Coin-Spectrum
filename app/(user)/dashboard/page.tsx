import { Button } from "@/components/ui/button";
import { getUserAuth, getUserId } from "@/lib/auth/utils";
import Link from "next/link";
import Dashboard from "@/components/dashboard/card";
import UserBalances from "@/components/dashboard/three-cards-2";
import { InvestmentDashboard } from "@/components/dashboard/three-cards";
import { SkeletonDemo } from "@/components/dashboard/skeleton";
import { Suspense } from "react";
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

export default function Home() {
  const userId = getUserId();
  if (!userId) {
    return <NoData shortText="user is not authenticated" />;
  }
  
  return (
    <main className="w-full">
      <Suspense fallback={<SkeletonDemo />}>
          <InvestmentDashboard userId={userId} runUntimed={false} />
          <StatsDashboard userId={userId} runUntimed={false} />
            <UserBalances />
            <TradingViewWidget2 />
            <TradingViewWidget />
            <TradingViewWidget3 />
            <TradingViewScreener />
      </Suspense>
    </main>
  );
}
