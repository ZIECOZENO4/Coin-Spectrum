"use client";
import { useAuth } from "./AuthProvider";
import AdminPage from "./stats";

interface DashboardStats {
  statistics: {
    totalUsers: number;
    totalInvestors: number;
    totalTraders: number;
    netProfit: number;
  };
  chartData: Array<{
    name: string;
    investments: number;
    trades: number;
  }>;
}

interface ChartData {
  name: string;
  investments: number;
  trades: number;
  sales: number; // Added to match the chart's requirements
}
export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return null; // Return nothing as Layout will handle showing Auth
  }
  // if (isLoading) return <Loading />;

  // const transformedChartData: ChartData[] = (data?.chartData || []).map(item => ({
  //   ...item,
  //   sales: item.investments + item.trades // Calculate sales as sum of investments and trades
  // }));

  // const { statistics, chartData } = data || {
  //   statistics: {
  //     totalUsers: 0,
  //     totalInvestors: 0,
  //     totalTraders: 0,
  //     netProfit: 0,
  //   },
  //   chartData: [],
  // };
  return (
    <div className="text-neutral-200 sm:px-8 w-full px-4 py-6 bg-black">
      <AdminPage />
    </div>
  );
}
