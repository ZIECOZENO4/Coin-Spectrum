"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useQuery } from "@tanstack/react-query";

interface Trade {
  // Define your trade properties here
  id: string;
  // Add other trade properties as needed
}

const fetchUserTrades = async (): Promise<Trade[]> => {
  const response = await fetch('/api/getTrades');
  if (!response.ok) throw new Error('Failed to fetch trades');
  const data = await response.json();
  console.log('Trade Response:', {
    totalTrades: data?.length || 0,
    tradeData: data
  });
  return data;
};

interface ConfirmWithdrawalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  setIsConfirmed: (confirmed: boolean) => void;
}

export function ConfirmWithdrawal({
  open,
  setIsOpen,
  setIsConfirmed,
}: ConfirmWithdrawalProps) {
  const { data: trades } = useQuery({
    queryKey: ['trades'],
    queryFn: fetchUserTrades,
    staleTime: 5000,
    cacheTime: 10000
  });

  const tradesCount = trades?.length || 0;
  const canWithdraw = tradesCount >= 3;

  const handleYes = () => {
    console.log('Confirming withdrawal:', {
      tradesCount,
      canWithdraw
    });
    setIsOpen(false);
    setIsConfirmed(true);
  };

  const handleCheck = () => {
    console.log('Checking withdrawal details');
    setIsOpen(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Confirm Withdrawal</DialogTitle>
        <DialogDescription>
          Are you sure that the wallet address and the crypto type are correct?
          Incorrect information might lead to money loss.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <Button 
          onClick={handleYes} 
          disabled={!canWithdraw}
          className={`${canWithdraw 
            ? 'bg-green-600 hover:bg-green-700' 
            : 'bg-gray-400 cursor-not-allowed'}`}
        >
          Yes
        </Button>
        <Button onClick={handleCheck} className="bg-red-600 hover:bg-red-700">
          Check
        </Button>
      </DialogFooter>
    </>
  );
}
