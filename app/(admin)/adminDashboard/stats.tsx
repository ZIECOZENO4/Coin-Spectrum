

'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion } from 'framer-motion'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
interface MonthlyStats {
    createdAt: string | Date;
    amount: number;
  }
  
  interface ChartDataItem {
    month: string;
    deposits: number;
    withdrawals: number;
  }
  
  interface DateFormatOptions extends Intl.DateTimeFormatOptions {
    month: 'short' | 'long' | 'narrow' | 'numeric' | '2-digit';
  }
const StatCard = ({ icon, title, value, delay }: {
  icon: React.ReactNode,
  title: string,
  value: string | number,
  delay: number
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-black shadow-lg rounded-md flex items-center justify-between p-3 border-b-4 border-yellow-500 text-white font-medium group"
  >
    <div className="flex justify-center items-center w-14 h-14 bg-yellow-500 rounded-full transition-all duration-300 transform group-hover:rotate-12">
      {icon}
    </div>
    <div className="text-right">
      <p className="text-2xl">{value}</p>
      <p className="text-yellow-500">{title}</p>
    </div>
  </motion.div>
)

const AdminPage = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const res = await fetch('/api/admin/stats')
      if (!res.ok) throw new Error('Failed to fetch stats')
      return res.json()
    }
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  const chartData = stats?.monthlyStats?.reduce<ChartDataItem[]>((acc, curr: MonthlyStats) => {
    const formatOptions: DateFormatOptions = { month: 'short' };
    const month = new Date(curr.createdAt).toLocaleString('default', formatOptions);
    const existing = acc.find((item: ChartDataItem) => item.month === month);
    
    if (existing) {
      existing.deposits += curr.amount;
    } else {
      acc.push({ month, deposits: curr.amount, withdrawals: 0 });
    }
    
    return acc;
  }, []) || [];
  
  

  return (
    <div className="p-4">
      <div className="grid w-full grid-cols-1 mx-8  sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard
          delay={0.1}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          }
          title="Total Users"
          value={stats?.totalUsers || 0}
        />

        <StatCard
          delay={0.2}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Total Deposits"
          value={`$${stats?.totalDeposits?.toLocaleString() || 0}`}
        />

        <StatCard
          delay={0.3}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          title="Total Withdrawals"
          value={`$${stats?.totalWithdrawals?.toLocaleString() || 0}`}
        />

        <StatCard
          delay={0.4}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          }
          title="Total Investments"
          value={`$${stats?.totalInvestments?.toLocaleString() || 0}`}
        />

        <StatCard
          delay={0.5}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          title="Active Investors"
          value={stats?.totalInvestors || 0}
        />

        <StatCard
          delay={0.6}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          title="Net Profit"
          value={`$${((stats?.totalDeposits || 0) - (stats?.totalWithdrawals || 0)).toLocaleString()}`}
        />
       <StatCard
          delay={0.7}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          }
          title="Total Trades"
          value={stats?.totalTrades || 0}
        />

        <StatCard
          delay={0.8}
          icon={
            <svg width="30" height="30" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="stroke-current text-black">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
          title="Signal Purchases"
          value={stats?.totalSignalPurchases || 0}
        />
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Monthly Deposits & Withdrawals</h3>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="deposits" stroke="#FFD700" strokeWidth={2} />
            <Line type="monotone" dataKey="withdrawals" stroke="#FF4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default AdminPage