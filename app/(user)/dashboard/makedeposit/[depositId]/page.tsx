'use client';

import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';

interface DepositDetailsPageProps {
  params: {
    depositId: string;
  }
}

export default function DepositDetailsPage({ params }: DepositDetailsPageProps) {
  const { data: deposit, isLoading } = useQuery({
    queryKey: ['deposit', params.depositId],
    queryFn: async () => {
      const res = await fetch(`/api/deposits/${params.depositId}`);
      if (!res.ok) throw new Error('Failed to fetch deposit');
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
        <div className="overflow-hidden rounded-lg bg-white shadow-lg">
          {/* Receipt Header */}
          <div className="border-b border-gray-200 bg-black p-6 text-center">
            <h1 className="text-2xl font-bold text-yellow-500">Deposit Receipt</h1>
            <p className="mt-2 text-white">Receipt #{deposit.id.slice(0, 8)}</p>
          </div>

          {/* Receipt Body */}
          <div className="p-6">
            <div className="mb-8 grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-600">From</h3>
                <p className="mt-1">
                  <span className="font-medium">{deposit.user.firstName} {deposit.user.lastName}</span><br />
                  {deposit.user.email}
                </p>
              </div>
              <div className="text-right">
                <h3 className="font-semibold text-gray-600">Date</h3>
                <p className="mt-1">{new Date(deposit.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Deposit Details */}
            <div className="mb-8 overflow-hidden rounded-lg border border-gray-200">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Description</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-500">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">Deposit ({deposit.type})</p>
                        <p className="text-sm text-gray-500">
                          {deposit.type === 'bank' 
                            ? `Bank Account: ${deposit.senderAccountNumber}`
                            : `Wallet: ${deposit.senderWalletAddress}`
                          }
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${deposit.amount.toLocaleString()}
                    </td>
                  </tr>
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-4 py-3 font-medium text-gray-900">Total</td>
                    <td className="px-4 py-3 text-right font-medium text-gray-900">
                      ${deposit.amount.toLocaleString()}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Status Badge */}
            <div className="mb-6 text-center">
              <span className={`inline-flex rounded-full px-3 py-1 text-sm font-medium
                ${deposit.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  deposit.status === 'successful' ? 'bg-green-100 text-green-800' :
                  'bg-red-100 text-red-800'}`}>
                {deposit.status.toUpperCase()}
              </span>
            </div>

            {/* Proof of Payment */}
            {deposit.proofImageUrl && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold text-gray-600">Proof of Payment</h3>
                <img 
                  src={deposit.proofImageUrl} 
                  alt="Proof of Payment"
                  className="max-h-64 w-full rounded-lg object-cover"
                />
              </div>
            )}

            {/* Notes */}
            {deposit.notes && (
              <div className="mt-6">
                <h3 className="mb-2 font-semibold text-gray-600">Notes</h3>
                <p className="text-gray-600">{deposit.notes}</p>
              </div>
            )}
          </div>

          {/* Receipt Footer */}
          <div className="border-t border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
            <p>Thank you for your deposit. For any questions, please contact support.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
