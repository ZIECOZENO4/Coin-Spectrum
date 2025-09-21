"use client";
import { useAUserAllInvestments } from "@/lib/tenstack-hooks/usealluserinvestments";
import React from "react";
import { useInView } from "react-intersection-observer";
import NoData from "@/components/noData";
import InvestmentCard from "./investmentCard";

interface Investment {
  id: string;
  name: string;
  price: number;
  profitPercent: number;
  rating: number;
  principalReturn: boolean;
  principalWithdraw: boolean;
  creditAmount: number;
  depositFee: string;
  debitAmount: number;
  durationDays: number;
}

interface InvestmentStatus {
  id: string;
  status: string;
}

interface UserInvestment {
  id: string;
  userId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  investment: Investment | null;
  status: InvestmentStatus | null;
}

interface InvestmentsResponse {
  investments: UserInvestment[];
}

interface InvestmentCardProps {
  id: string;
  name: string;
  createdAt: string | Date;
  status: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
}

const InfiniteScrollComponent = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
    isLoading,
  } = useAUserAllInvestments();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading investments</div>;
  }

  if (!data || !data.pages || data.pages.length === 0) {
    return <NoData shortText="There is no investment found" />;
  }

  return (
    <div className="flex flex-col justify-center gap-4">
      <h1 className="text-2xl mt-3 font-extrabold text-center">ALL INVESTMENTS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {data.pages.map((page: InvestmentsResponse, pageIndex: number) => (
          <React.Fragment key={pageIndex}>
            {page.investments?.map((userInvestment: UserInvestment) => (
              <InvestmentCard
                key={userInvestment.id}
                id={userInvestment.id}
                name={userInvestment.investment?.name || "Unknown Investment"}
                createdAt={new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(userInvestment.createdAt))}
                status={userInvestment.status?.status || (userInvestment.investment?.principalReturn ? "Active" : "Pending")}
                minAmount={userInvestment.investment?.price || 0}
                maxAmount={userInvestment.investment?.price || null}
                roi={userInvestment.investment?.profitPercent || 0}
                durationHours={(userInvestment.investment?.durationDays || 0) * 24}
              />
            ))}
          </React.Fragment>
        ))}
        {hasNextPage && (
          <div ref={ref} className="col-span-full text-center p-4">
            {isFetchingNextPage ? (
              <span>Loading more...</span>
            ) : (
              <span>Load more</span>
            )}
          </div>
        )}
        {!hasNextPage && !isFetchingNextPage && data.pages[0].investments.length > 0 && (
          <div className="col-span-full text-center p-4">
            <span>No more investments to load</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default InfiniteScrollComponent;
