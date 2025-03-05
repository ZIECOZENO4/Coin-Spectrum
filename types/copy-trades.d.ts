// types/copy-trades.d.ts
export interface UserCopyTrade {
    copyTrade: {
      id: string;
      amount: number;
      status: "active" | "completed" | "cancelled";
      createdAt: string;
    };
    trader: {
      name: string;
      percentageProfit: number;
      totalProfit: number;
      rating: number;
    };
  }
  