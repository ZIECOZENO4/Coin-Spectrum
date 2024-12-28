"use client";
import React from "react";
import { format, formatDistanceToNow } from "date-fns";
import { DrawerDialogDemo } from "@/components/custom-component/drawer-or-dialogue";
import { Button } from "@/components/ui/button";
import { WithdrawalStatusForm } from "./withdrawalStatusForm";
import { useGetAUserWithdrawal } from "@/lib/tenstack-hooks/useGetAuserWithdrawal";

interface WithdrawalDetailsProps {
  id: string;
}

export const WithdrawalDetails: React.FC<WithdrawalDetailsProps> = ({ id }) => {
  const { data } = useGetAUserWithdrawal(id);

  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  const formatDateFromNow = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  if (!data) return <div>Loading...</div>;

  const {
    createdAt,
    updatedAt,
    user,
    amount,
    status,
    walletAddress,
    cryptoType,
  } = data;

  return (
    <div className="sm:p-8 p-4 space-y-8 text-sm text-gray-300 w-full bg-black">
      <div className="flex items-center justify-between">
        <div></div>
        <DrawerDialogDemo
          component={({ setIsOpen }) => (
            <div className="min-h-20 ">
              <WithdrawalStatusForm withdrawalId={id} setIsOpen={setIsOpen} />
            </div>
          )}
        >
          <Button variant="outline" className="bg-rose-400 ml-4">
            Change Status
          </Button>
        </DrawerDialogDemo>
      </div>

      <section className="bg-neutral-950 p-6 rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-orange-500">
          Withdrawal Details
        </h2>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Status:</span>
            <span>{status}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Amount:</span>
            <span>${amount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">CryptoType:</span>
            <span>{cryptoType ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Account Name:</span>
            <span>{walletAddress ?? "N/A"}</span>
          </div>

          <div className="flex justify-between">
            <span className="font-semibold">Created At:</span>
            <span>({formatDateFromNow(new Date(createdAt))})</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Updated At:</span>
            <span>
              {formatDate(new Date(updatedAt))} (
              {formatDateFromNow(new Date(updatedAt))})
            </span>
          </div>
        </div>
      </section>

      <section className="bg-neutral-950 p-6 rounded-lg shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-orange-500">
          User Information
        </h2>
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between">
            <span className="font-semibold">Name:</span>
            <span>{user.fullName ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Email:</span>
            <span>{user.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Username:</span>
            <span>{user.userName ?? "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Role:</span>
            <span>{user.role}</span>
          </div>
        </div>
      </section>
    </div>
  );
};
