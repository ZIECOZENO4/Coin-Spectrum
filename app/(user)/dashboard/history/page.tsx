// app/history/page.tsx
"use client";
import { useQuery } from "@tanstack/react-query";
import { Separator } from "@/components/ui/separator";
import TransactionCard from "./aside";

export default function TransactionHistory() {
  const { data: transactions, isLoading } = useQuery({
    queryKey: ["transactions"],
    queryFn: async () => {
      const res = await fetch("/api/transactions/history");
      if (!res.ok) throw new Error("Failed to fetch transactions");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black p-6 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Transaction History</h1>
        </div>
        
        <Separator className="bg-yellow-400/20" />
        
        <div className="space-y-4">
          {transactions?.map((transaction: any) => (
            <TransactionCard
              key={transaction.id}
              type={transaction.type}
              amount={transaction.amount}
              date={new Date(transaction.createdAt)}
              description={transaction.description || "Transaction"}
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
