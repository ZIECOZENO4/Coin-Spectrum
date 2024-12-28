"use client";
import { useAUserAllInvestments } from "@/lib/tenstack-hooks/usealluserinvestments";
import React from "react";
import { useInView } from "react-intersection-observer";
import NoData from "@/components/noData";
import InvestmentCard from "./investmentCard";

const InfiniteScrollComponent = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useAUserAllInvestments();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (data?.pages.length === 0) {
    return <NoData shortText="There is no investment found" />;
  }

  return (
    <div className="flex flex-col justify-center gap-4">
      <h1 className="text-2xl font-extrabold text-center ">YOUR INVESTMENTS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3  gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.investments.map((investment) => (
              <InvestmentCard
                key={investment.id}
                id={investment.id}
                name={investment.name}
                createdAt={investment.createdAt}
                status={
                  investment.status?.status === "CONFIRMED"
                    ? "Confirmed"
                    : "Pending"
                }
                price={investment.plan.price}
                profitPercent={investment.plan.profitPercent}
                durationDays={investment.plan.durationDays}
                rating={investment.plan.rating}
              />
            ))}
          </React.Fragment>
        ))}
        <div ref={ref}>
          {isFetchingNextPage
            ? "Loading more..."
            : hasNextPage
            ? "Load more"
            : "No more data"}
        </div>
      </div>
    </div>
  );
};

export default InfiniteScrollComponent;
