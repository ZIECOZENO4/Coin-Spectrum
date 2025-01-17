// app/dashboard/pending-withdrawals/page.tsx
"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/formatCurrency";
import { usePendingWithdrawals } from "@/lib/tenstack-hooks/usePendingWithdrawals";
import { format } from "date-fns";

export default function PendingWithdrawalsPage() {
  const { data: withdrawals, isLoading, error } = usePendingWithdrawals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">Loading withdrawals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          Failed to load withdrawals
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Pending Withdrawals</h1>
      
      {withdrawals?.length === 0 ? (
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-gray-500">
              No pending withdrawals found
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {withdrawals?.map((withdrawal) => (
            <Card key={withdrawal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">
                  {formatCurrency(withdrawal.amount)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Status:</span>
                    <span className="text-sm text-orange-500">
                      {withdrawal.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Crypto:</span>
                    <span className="text-sm">{withdrawal.cryptoType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Wallet:</span>
                    <span className="text-sm truncate max-w-[200px]">
                      {withdrawal.walletAddress}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Date:</span>
                    <span className="text-sm">
                      {format(new Date(withdrawal.createdAt), 'PPp')}
                    </span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="text-sm font-medium mb-1">User Details:</div>
                    <div className="text-sm">{withdrawal.user.email}</div>
                    <div className="text-sm">
                      {withdrawal.user.firstName} {withdrawal.user.lastName}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
