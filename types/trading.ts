// types/trading.ts
export interface Trade {
    id: string;
    type: 'TRADE' | 'SIGNAL' | 'COPY';
    pair: string;
    amount: number;
    timestamp: Date;
    status: string;
    leverage?: string;
    profit?: number | null;
    expiresAt?: Date;
  }
  
  export interface TradingHistoryStats {
    totalTrades: number;
    totalProfit: number;
    averageProfit: number;
    winRate: number;
    activeSignals: number;
    activeCopies: number;
  }
  