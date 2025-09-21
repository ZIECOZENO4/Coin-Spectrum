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
import { useDataTableStore } from "@/lib/zuustand-store";

interface FilterFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
}

const sortOptions = [
  { value: "createdAtDesc", label: "Newest First" },
  { value: "createdAtAsc", label: "Oldest First" },
  { value: "nameAsc", label: "Name A-Z" },
  { value: "nameDesc", label: "Name Z-A" },
];

const investmentFilterOptions = [
  { value: "all", label: "All Users" },
  { value: "with_investments", label: "Users with Investments" },
  { value: "without_investments", label: "Users without Investments" },
];

export function FilterForm({ setIsOpen, className }: FilterFormProps) {
  const { sort, setSort, order, setOrder } = useDataTableStore();

  const [selectedSort, setSelectedSort] = useState(sort);
  const [selectedOrder, setSelectedOrder] = useState(order);
  const [selectedInvestmentFilter, setSelectedInvestmentFilter] = useState("all");

  const handleFilter = () => {
    setSort(selectedSort);
    setOrder(selectedOrder);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            defaultValue={selectedSort}
            onValueChange={(value) => {
              setSelectedSort(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select sort option" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="investmentFilter">Investment Filter</Label>
          <Select
            defaultValue={selectedInvestmentFilter}
            onValueChange={(value) => {
              setSelectedInvestmentFilter(value);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select investment filter" />
            </SelectTrigger>
            <SelectContent>
              {investmentFilterOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleFilter}>Apply Filter</Button>
      </div>
    </div>
  );
}
