// app/withdrawals/[withdrawalId]/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface WithdrawalDetailsPageProps {
  params: {
    withdrawalId: string;
  }
}

export default function WithdrawalDetailsPage({ params }: WithdrawalDetailsPageProps) {
  const { data: withdrawal, isLoading } = useQuery({
    queryKey: ['withdrawal', params.withdrawalId],
    queryFn: async () => {
      const res = await fetch(`/api/withdrawals/${params.withdrawalId}`);
      if (!res.ok) throw new Error('Failed to fetch withdrawal');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-yellow-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-black p-8"
    >
      <div className="mx-auto max-w-2xl">
        <div className="overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Receipt Header */}
          <div className="border-b border-gray-200 bg-yellow-500 p-6 text-center">
            <h1 className="text-2xl font-bold text-black">Withdrawal Receipt</h1>
            <p className="mt-2 text-black">Reference #{withdrawal.id.slice(0, 8)}</p>
          </div>

          {/* Receipt Body */}
          <div className="p-6">
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600">Account Holder</h3>
                <p className="mt-1">
                  <span className="font-medium">{withdrawal.user.firstName} {withdrawal.user.lastName}</span><br />
                  {withdrawal.user.email}
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-600">Date</h3>
                <p className="mt-1">{new Date(withdrawal.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Withdrawal Details */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-gray-200">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">Withdrawal ({withdrawal.type})</p>
                        <p className="text-sm text-gray-500">
                          {withdrawal.type === 'bank' 
                            ? `Bank Account: ${withdrawal.paymentMethod.accountNumber}`
                            : `Wallet: ${withdrawal.paymentMethod.walletAddress}`
                          }
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${withdrawal.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Status Badge */}
            <div className="mb-6 text-center">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                ${withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  withdrawal.status === 'successful' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'}`}>
                {withdrawal.status.toUpperCase()}
              </span>
            </div>

            {/* Payment Method Details */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-700">Payment Details</h3>
              {withdrawal.type === 'bank' ? (
                <>
                  <p>Bank Name: {withdrawal.paymentMethod.bankName}</p>
                  <p>Account Name: {withdrawal.paymentMethod.accountHolderName}</p>
                  <p>Account Number: {withdrawal.paymentMethod.accountNumber}</p>
                </>
              ) : (
                <>
                  <p>Wallet Provider: {withdrawal.paymentMethod.walletProvider}</p>
                  <p className="break-all">Wallet Address: {withdrawal.paymentMethod.walletAddress}</p>
                </>
              )}
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            <p>Thank you for using our service. For any questions, please contact support.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
