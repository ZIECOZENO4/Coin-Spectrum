"use client";
import { useAUserAllInvestments } from "@/lib/tenstack-hooks/usealluserinvestments";
import React from "react";
import { useInView } from "react-intersection-observer";
import NoData from "@/components/noData";
import InvestmentCard from "./investmentCard";

interface Investment {
  id: string;
  name: string;
  minAmount: number;
  maxAmount: number | null;
  roi: number;
  durationHours: number;
  instantWithdrawal: boolean;
  createdAt: string;
  updatedAt: string;
}

interface InvestmentsResponse {
  investments: Investment[];
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
      <h1 className="text-2xl font-extrabold text-center">YOUR INVESTMENTS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {data.pages.map((page: InvestmentsResponse, pageIndex: number) => (
          <React.Fragment key={pageIndex}>
            {page.investments?.map((investment: Investment) => (
              <InvestmentCard
                key={investment.id}
                id={investment.id}
                name={investment.name}
                createdAt={new Intl.DateTimeFormat('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }).format(new Date(investment.createdAt))}
                status={investment.instantWithdrawal ? "Active" : "Pending"}
                minAmount={investment.minAmount}
                maxAmount={investment.maxAmount}
                roi={investment.roi}
                durationHours={investment.durationHours}
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
