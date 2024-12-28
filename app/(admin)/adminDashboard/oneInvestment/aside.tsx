"use client";
import React from "react";
import Image from "next/image";
import { format, formatDistanceToNow } from "date-fns";

import { DrawerDialogDemo } from "@/components/custom-component/drawer-or-dialogue";
import { Button } from "@/components/ui/button";
import { StatusForm } from "./statusForm";

import {
  Investment,
  InvestmentPlan,
  User,
  ImageProof,
  InvestmentStatus,
} from "@prisma/client";
import { useAUserInvestment } from "@/lib/tenstack-hooks/useGetAuserInvestment";
import { useQueryClient } from "@tanstack/react-query";

// type InvestmentDetails = Investment & {
//   imageProofUrl: ImageProof[];
//   plan: InvestmentPlan;
//   user: User;
//   status: InvestmentStatus | null;
// };

export const InvestmentDetails = ({ id }: { id: string }) => {
  const { data: investment } = useAUserInvestment(id);
  const {
    createdAt,
    updatedAt,
    userId,
    plan,
    user,
    imageProofUrl,
    status,
    startIncrease,
    dateToStartIncrease,
    transactionId,
    name,
    email,
    walletPaidInto,
  } = investment;
  const formatDate = (date: Date) => {
    return format(date, "MMMM d, yyyy");
  };

  const formatDateFromNow = (date: Date) => {
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <div className="sm:p-8 p-4 space-y-8 text-sm text-gray-300 max-w-3xl bg-black">
      <div className="flex items-center justify-between">
        <div></div>
        <DrawerDialogDemo
          component={({ setIsOpen }) => (
            <div className="min-h-20 ">
              <StatusForm
                investmentId={id}
                userId={userId}
                setIsOpen={setIsOpen}
              />
            </div>
          )}
        >
          <Button variant="outline" className="bg-rose-400 ml-4">
            Change Status
          </Button>
        </DrawerDialogDemo>
      </div>

      {/* User Information Section */}
      <section className="bg-neutral-950 p-4 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-yellow-500">
          User Information
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Name: </span>
            <span>{user.fullName ?? "N/A"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Email: </span>
            <span>{user.email}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Username: </span>
            <span>{user.userName ?? "N/A"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Role: </span>
            <span>{user.role}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Account Number: </span>
            <span>{user.accountNumber ?? "N/A"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Account Name: </span>
            <span>{user.accountName ?? "N/A"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Bank Name: </span>
            <span>{user.bankName ?? "N/A"}</span>
          </div>
        </div>
      </section>

      {/* Investment Details Section */}
      <section className="bg-neutral-950 p-4 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-yellow-500">
          Investment Details
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Status: </span>
            <span>{status?.status ?? "N/A"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Created At: </span>
            <span>{formatDateFromNow(createdAt)}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Updated At: </span>
            <span>
              {formatDate(updatedAt)} ({formatDateFromNow(updatedAt)})
            </span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Start Increase: </span>
            <span>{startIncrease ? "Yes" : "No"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Date to Start Increase: </span>
            <span>
              {dateToStartIncrease ? formatDate(dateToStartIncrease) : "N/A"}
            </span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Transaction ID: </span>
            <span>{transactionId}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Name: </span>
            <span>{name}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Email: </span>
            <span>{email}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Wallet Paid Into: </span>
            <span>{walletPaidInto}</span>
          </div>
        </div>
      </section>

      {/* Investment Plan Section */}
      <section className="bg-neutral-950 p-4 rounded-lg">
        <h2 className="mb-4 text-2xl font-bold text-yellow-500">
          Investment Plan
        </h2>
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Plan Name: </span>
            <span>{plan.name}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">profit per day: </span>
            <span>{plan.dailyProfit}%</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Total Profit: </span>
            <span>{plan.totalProfit}%</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Price: </span>
            <span>${plan.price}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Duration: </span>
            <span>{plan.duration} days</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Profit Percent: </span>
            <span>{plan.profitPercent}%</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Rating: </span>
            <span>{plan.rating}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Principal Return: </span>
            <span>{plan.principalReturn ? "Yes" : "No"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Principal Withdraw: </span>
            <span>{plan.principalWithdraw ? "Yes" : "No"}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Credit Amount: </span>
            <span>${plan.creditAmount}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Deposit Fee: </span>
            <span>{plan.depositFee}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Debit Amount: </span>
            <span>${plan.debitAmount}</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <span className="font-semibold">Duration Days: </span>
            <span>{plan.durationDays}</span>
          </div>
        </div>
      </section>

      {/* Image Proof Section */}
      {imageProofUrl.length > 0 && (
        <section className="bg-neutral-950 p-4 rounded-lg">
          <h2 className="mb-4 text-2xl font-bold text-yellow-500">
            Image Proof
          </h2>
          <div className="flex flex-wrap gap-4">
            {imageProofUrl.map((img) => (
              <div key={img.id} className="sm:flex-none flex-1 min-w-[200px]">
                <Image
                  src={img.url}
                  alt="Proof"
                  width={500}
                  height={500}
                  className="rounded-lg"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
