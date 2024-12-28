import { Button } from "@/components/ui/button";
import { getUserAuth, getUserId } from "@/lib/auth/utils";
import Link from "next/link";
import Dashboard from "@/components/dashboard/card";
import UserBalances from "@/components/dashboard/three-cards-2";
import { InvestmentDashboard } from "@/components/dashboard/three-cards";
import { SkeletonDemo } from "@/components/dashboard/skeleton";
import { Suspense } from "react";
import NoData from "@/components/noData";
export default function Home() {
  const userId = getUserId();
  if (!userId) {
    return <NoData shortText="user is not authenticated" />;
  }
  return (
    <main className="w-full ">
      <Suspense fallback={<SkeletonDemo />}>
        <InvestmentDashboard userId={userId} runUntimed={false} />
      </Suspense>
      <UserBalances />
    </main>
  );
}
