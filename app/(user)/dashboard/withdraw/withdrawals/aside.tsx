"use client";
import { useUserWithdrawals } from "@/lib/tenstack-hooks/useUserWithdrawals";
import React from "react";
import { useInView } from "react-intersection-observer";
import NoData from "@/components/noData";
import WithdrawalCard from "./withdrawalCard";

const InfiniteScrollWithdrawals = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useUserWithdrawals();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);
  console.log("this is the data that is returned", data);
  const withdrawalsExist = data?.pages.some(
    (page) => page.withdrawals.length > 0
  );

  if (!withdrawalsExist) {
    return <NoData shortText="No withdrawals found" />;
  }

  return (
    <div className="flex flex-col justify-center gap-4">
      <h1 className="text-2xl font-extrabold text-center">YOUR WITHDRAWALS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.withdrawals.map((withdrawal) => (
              <WithdrawalCard
                key={withdrawal.id}
                id={withdrawal.id}
                amount={withdrawal.amount}
                status={withdrawal.status}
                createdAt={withdrawal.createdAt}
                walletAddress={withdrawal.walletAddress}
                cryptoType={withdrawal.cryptoType}
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

export default InfiniteScrollWithdrawals;
