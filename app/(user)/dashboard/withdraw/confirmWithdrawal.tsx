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
}

export function ConfirmWithdrawal({
  open,
  setIsOpen,
  setIsConfirmed,
}: ConfirmWithdrawalProps) {
  const handleYes = () => {
    setIsOpen(false);
    setIsConfirmed(true);
  };

  const handleCheck = () => {
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
        <Button onClick={handleYes} className="bg-green-600 hover:bg-green-700">
          Yes
        </Button>
        <Button onClick={handleCheck} className="bg-red-600 hover:bg-red-700">
          Check
        </Button>
      </DialogFooter>
    </>
  );
}
