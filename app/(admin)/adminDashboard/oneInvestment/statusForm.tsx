// StatusForm.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { InvestmentStatusEnum } from "@prisma/client";
import { toast } from "sonner";

import { useQueryClient } from "@tanstack/react-query";
// import useProcessInvestments from "@/lib/tenstack-hooks/useMutationProcessInvestment";
import useUpdateInvestmentStatus from "@/lib/tenstack-hooks/useUpdateInvestmentStatus";

interface StatusFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
  investmentId: string;
  userId: string;
}

const investmentStatusOptions = Object.values(InvestmentStatusEnum);

export function StatusForm({
  setIsOpen,
  className,
  investmentId,
  userId,
}: StatusFormProps) {
  const [selectedStatus, setSelectedStatus] =
    useState<InvestmentStatusEnum | null>(null);
  const [showSelect, setShowSelect] = useState(false);
  const queryClient = useQueryClient();

  const updateInvestmentStatusMutation = useUpdateInvestmentStatus();
  // const processInvestmentsMutation = useProcessInvestments();

  const handleChangeStatus = () => {
    setShowSelect(true);
  };

  const handleSetStatus = async () => {
    if (selectedStatus) {
      try {
        await toast.promise(
          updateInvestmentStatusMutation.mutateAsync(
            {
              investmentId,
              status: selectedStatus,
            },
            {
              onSuccess(data, variables, context) {
                // queryClient.invalidateQueries({ queryKey: ["investments"] });
                queryClient.invalidateQueries({
                  queryKey: ["a-user-investment"],
                });
                setIsOpen(false);
              },
              onError(data, variables, context) {
                toast.error("Failed to update investment status.");
              },
            }
          ),
          {
            loading: "Updating investment status...",
            success: "Investment status updated successfully!",
            error: "Failed to update investment status.",
          }
        );
        //for processing the pricing of the investment
        // await toast.promise(
        //   processInvestmentsMutation.mutateAsync({ userId, runUntimed: true }),
        //   {
        //     loading: "Processing investments...",
        //     success: "Investments processed successfully!",
        //     error: "Failed to process investments.",
        //   }
        // );
      } catch (error) {
        console.error(
          "Error updating investment status or processing investments:",
          error
        );
      }
    }
  };

  return (
    <div className={"min-h-10"}>
      <div className=" space-y-4">
        {showSelect ? (
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              onValueChange={(value) =>
                setSelectedStatus(value as InvestmentStatusEnum)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {investmentStatusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ) : (
          <Button onClick={handleChangeStatus}>Change Status</Button>
        )}
      </div>
      {showSelect && (
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleSetStatus}
            disabled={
              updateInvestmentStatusMutation.isPending
              // processInvestmentsMutation.isPending
            }
          >
            Set Status
          </Button>
        </div>
      )}
    </div>
  );
}
