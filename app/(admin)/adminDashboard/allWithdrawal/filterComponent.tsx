// FilterForm.tsx
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
import { useWithdrawalDataTableStore } from "@/lib/zuustand-store";

interface FilterFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
}

const withdrawalStatusOptions = Object.values(WithdrawalStatus);

export function FilterForm({ setIsOpen, className }: FilterFormProps) {
  const { statusFilter, setStatusFilter } = useWithdrawalDataTableStore();

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState(statusFilter);

  const handleFilter = () => {
    setStatusFilter(selectedStatusFilter);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            defaultValue={selectedStatusFilter}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedStatusFilter("");
              } else {
                setSelectedStatusFilter(value as WithdrawalStatus);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {withdrawalStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleFilter}>Filter</Button>
      </div>
    </div>
  );
}
