// app/history/page.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import TransactionCard from "./aside";
import Loading from "@/app/loading";

interface Transaction {
  id: string;
  type: "deposit" | "withdrawal" | "investment" | "trade";
  amount: number;
  createdAt: string;
  description: string;
  direction?: "IN" | "OUT";
}

export default function TransactionHistory() {
  const { data, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/history");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      return {
        transactions: data.transactions || [],
        totalPages: data.totalPages,
        currentPage: data.currentPage
      };
    },
  });

  if (isLoading) return <div><Loading /></div>;

  const transactions = data?.transactions || [];

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        </div>
        
        <Separator className="bg-yellow-400/20" />
        
        <div className="space-y-4">
          {transactions?.map((transaction: Transaction) => (
            <TransactionCard
              key={transaction.id}
              id={transaction.id}
              type={transaction.type}
              amount={transaction.amount}
              date={new Date(transaction.createdAt)}
              description={transaction.description || "Transaction"}
              direction={transaction.direction}
            />
          ))}
          
          {transactions?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
