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
import { WithdrawalStatus } from "@prisma/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import useUpdateWithdrawalStatus from "@/lib/tenstack-hooks/useUpdateWithdrawalStatus";

interface WithdrawalStatusFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
  withdrawalId: string;
}

const withdrawalStatusOptions = Object.values(WithdrawalStatus);

/* This code defines a React functional component called `WithdrawalStatusForm` that allows users to
change the status of a withdrawal. Here's a breakdown of what the component does: */
export function WithdrawalStatusForm({
  setIsOpen,
  className,
  withdrawalId,
}: WithdrawalStatusFormProps) {
  const [selectedStatus, setSelectedStatus] = useState<WithdrawalStatus | null>(
    null
  );
  const [showSelect, setShowSelect] = useState(false);
  const queryClient = useQueryClient();

  const updateWithdrawalStatusMutation = useUpdateWithdrawalStatus();

  const handleChangeStatus = () => {
    setShowSelect(true);
  };

  const handleSetStatus = async () => {
    if (selectedStatus) {
      try {
        await toast.promise(
          updateWithdrawalStatusMutation.mutateAsync(
            {
              withdrawalId,
              status: selectedStatus,
            },
            {
              onSuccess(data, variables, context) {
                queryClient.invalidateQueries({
                  queryKey: ["a-user-withdrawal"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["all-investments"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["withdrawals"],
                });
                queryClient.invalidateQueries({
                  queryKey: ["users"],
                });
                setIsOpen(false);
              },
              onError(data, variables, context) {
                toast.error("Failed to update withdrawal status.");
              },
            }
          ),
          {
            loading: "Updating withdrawal status...",
            success: "Withdrawal status updated successfully!",
            error: "Failed to update withdrawal status.",
          }
        );
      } catch (error) {
        console.error("Error updating withdrawal status:", error);
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
                setSelectedStatus(value as WithdrawalStatus)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                {withdrawalStatusOptions.map((status) => (
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
            disabled={updateWithdrawalStatusMutation.isPending}
          >
            Set Status
          </Button>
        </div>
      )}
    </div>
  );
}
