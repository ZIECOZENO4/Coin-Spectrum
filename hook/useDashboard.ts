// hooks/useDashboard.ts
import { DashboardData } from '@/app/api/dashboard/route';
import { useQuery } from '@tanstack/react-query';

interface ChartDataPoint {
  name: string;
  investments: number;
  trades: number;
  sales: number;
}

interface DashboardStatistics {
  totalUsers: number;
  totalInvestors: number;
  totalTraders: number;
  netProfit: number;
}

interface ProcessedDashboardData {
  statistics: DashboardStatistics;
  chartData: ChartDataPoint[];
}

export function useDashboard() {
  const { data, isLoading, error } = useQuery<DashboardData>({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    }
  });

  const processedData: ProcessedDashboardData | undefined = data ? {
    statistics: {
      totalUsers: Number(data.users[0]?.count || 0),
      totalInvestors: Number(data.investors[0]?.count || 0),
      totalTraders: Number(data.traders[0]?.count || 0),
      netProfit: Number(data.transactions[0]?.deposits || 0) - 
                Number(data.transactions[0]?.withdrawals || 0)
    },
    chartData: Array.from({ length: 30 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const investmentEntry = data.investments.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );
      const tradingEntry = data.trades.find(d => 
        new Date(d.date).toISOString().split('T')[0] === dateStr
      );

      return {
        name: new Date(dateStr).toLocaleDateString(),
        investments: Number(investmentEntry?.total || 0),
        trades: Number(tradingEntry?.total || 0),
        sales: Number(investmentEntry?.total || 0) + Number(tradingEntry?.total || 0)
      };
    }).reverse()
  } : undefined;

  return {
    data: processedData,
    isLoading,
    error
  };
}
