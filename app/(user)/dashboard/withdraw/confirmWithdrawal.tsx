"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ConfirmWithdrawalProps {
  open: boolean;
  setIsOpen: (open: boolean) => void;
  setIsConfirmed: (confirmed: boolean) => void;
  eligibilityData: {
    isEligible: boolean;
    tradeCount: number;
    requirementStatus: string;
  };
}

export function ConfirmWithdrawal({
  open,
  setIsOpen,
  setIsConfirmed,
  eligibilityData
}: ConfirmWithdrawalProps) {
  const remainingTrades = Math.max(3 - eligibilityData.tradeCount, 0);

  const handleYes = () => {
    console.log('Confirming withdrawal:', {
      tradeCount: eligibilityData.tradeCount,
      isEligible: eligibilityData.isEligible,
      status: eligibilityData.requirementStatus
    });
    setIsOpen(false);
    setIsConfirmed(true);
  };

  const handleCheck = () => {
    console.log('Checking withdrawal requirements');
    setIsOpen(false);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Withdrawal Verification</DialogTitle>
        <DialogDescription>
          {eligibilityData.isEligible ? (
            `You have ${eligibilityData.tradeCount} verified trades. Confirm wallet details:`
          ) : (
            `Requires ${remainingTrades} more trades (${eligibilityData.tradeCount}/3 completed)`
          )}
        </DialogDescription>
      </DialogHeader>
      <DialogFooter className="gap-3">
        <Button 
          onClick={handleYes} 
          disabled={!eligibilityData.isEligible}
          className={`w-full ${
            eligibilityData.isEligible 
              ? 'bg-green-600 hover:bg-green-700' 
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          {eligibilityData.isEligible ? 'Confirm Withdrawal' : 'Requirements Not Met'}
        </Button>
        <Button 
          onClick={handleCheck}
          variant="outline" 
          className="w-full bg-red-600 text-white hover:bg-red-700"
        >
          Review Details
        </Button>
      </DialogFooter>
    </>
  );
}
