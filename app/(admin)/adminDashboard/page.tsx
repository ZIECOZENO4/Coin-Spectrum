"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CircleDollarSign, Users, TrendingUp } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { formatCurrencyNaira } from "@/lib/formatCurrency";
import { toast } from "sonner";
import SalesChart from "./chart";
import Loading from "@/app/loading";
import { useAuth } from "./AuthProvider";
import Auth from "./auth";
import DashboardComponent from "./stats";
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

      {/* <div className="sm:flex-row flex flex-col items-center justify-between mb-4">
        <p className="text-heading3-bold sm:mb-0 mb-2">Dashboard</p>
      </div>
      <Separator className="bg-neutral-700 my-4" />

      <div className="sm:grid-cols-2 md:grid-cols-4 grid grid-cols-1 gap-6">
        <Card className="bg-natural-900">
          <CardHeader className="text-neutral-300 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Users</CardTitle>
            <Users className="sm:block hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{statistics.totalUsers}</p>
          </CardContent>
        </Card>

        <Card className="bg-natural-900">
          <CardHeader className="text-neutral-300 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Investors</CardTitle>
            <CircleDollarSign className="sm:block hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{statistics.totalInvestors}</p>
          </CardContent>
        </Card>

        <Card className="bg-natural-900">
          <CardHeader className="text-neutral-300 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Total Traders</CardTitle>
            <TrendingUp className="sm:block hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">{statistics.totalTraders}</p>
          </CardContent>
        </Card>

        <Card className="bg-natural-900">
          <CardHeader className="text-neutral-300 flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Net Profit</CardTitle>
            <CircleDollarSign className="sm:block hidden" />
          </CardHeader>
          <CardContent>
            <p className="text-body-bold text-lg">
              {formatCurrencyNaira(statistics.netProfit)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-natural-900 mt-8">
        <CardHeader>
          <CardTitle className="text-sm">Investment vs Trading Volume</CardTitle>
        </CardHeader>
        <CardContent>
        <SalesChart data={transformedChartData} />
        </CardContent>
      </Card>
      <DashboardComponent /> */}

      <AdminPage />
    </div>
  );
}
