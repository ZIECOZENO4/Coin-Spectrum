"use client";
import React from "react";
import { useInView } from "react-intersection-observer";
import NoData from "@/components/noData";
import { useUserAllTransactions } from "@/lib/tenstack-hooks/useUserAllTransactions";
import TransactionCard from "./historycard";

const InfiniteScrollComponent = () => {
  const { ref, inView } = useInView();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useUserAllTransactions();

  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, fetchNextPage, hasNextPage]);

  if (data?.pages.length === 0) {
    return <NoData shortText="There is no transaction history found" />;
  }

  return (
    <div className="flex flex-col justify-center gap-4">
      <h1 className="text-2xl font-extrabold text-center">YOUR TRANSACTIONS</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {data?.pages.map((page, pageIndex) => (
          <React.Fragment key={pageIndex}>
            {page.transactions.map((transaction) => (
              <TransactionCard
                key={transaction.id}
                type={transaction.type}
                amount={transaction.amount}
                date={new Date(transaction.createdAt)}
                description={transaction.description}
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
