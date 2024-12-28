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
import { InvestmentStatusEnum, InvestmentPlanName } from "@prisma/client";
import { useDataTableStore } from "@/lib/zuustand-store";

interface FilterFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
}

const investmentStatusOptions = Object.values(InvestmentStatusEnum);
const investmentPlanOptions = Object.values(InvestmentPlanName);

export function FilterForm({ setIsOpen, className }: FilterFormProps) {
  const { statusFilter, setStatusFilter, planFilter, setPlanFilter } =
    useDataTableStore();

  const [selectedStatusFilter, setSelectedStatusFilter] =
    useState(statusFilter);
  const [selectedPlanFilter, setSelectedPlanFilter] = useState(planFilter);

  const handleFilter = () => {
    setStatusFilter(selectedStatusFilter);
    setPlanFilter(selectedPlanFilter);
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
                setSelectedStatusFilter(value as InvestmentStatusEnum);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {investmentStatusOptions.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="plan">Plan</Label>
          <Select
            defaultValue={selectedPlanFilter}
            onValueChange={(value) => {
              if (value === "all") {
                setSelectedPlanFilter("");
              } else {
                setSelectedPlanFilter(value as InvestmentPlanName);
              }
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select plan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {investmentPlanOptions.map((plan) => (
                <SelectItem key={plan} value={plan}>
                  {plan}
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
