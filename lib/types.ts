// lib/types.ts
export interface Trader {
    id: string;
    name: string;
    imageUrl: string;
    followers: number;
    minCapital: number;
    percentageProfit: number;
    totalProfit: number;
    rating: number;
    isPro: boolean;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface TraderFormData {
    name: string;
    imageUrl: string;
    followers?: number;
    minCapital: number;
    percentageProfit: number;
    totalProfit?: number;
    rating: number;
    isPro?: boolean;
  }
  