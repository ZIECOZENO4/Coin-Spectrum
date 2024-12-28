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
import { useUserDataTableStore } from "@/lib/zuustand-store";

interface FilterFormProps {
  setIsOpen: (open: boolean) => void;
  className?: string;
}

export function FilterForm({ setIsOpen, className }: FilterFormProps) {
  const { search, setSearch } = useUserDataTableStore();

  const [selectedSearch, setSelectedSearch] = useState(search);

  const handleFilter = () => {
    setSearch(selectedSearch);
    setIsOpen(false);
  };

  return (
    <div className={className}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <input
            type="text"
            id="search"
            value={selectedSearch}
            onChange={(e) => setSelectedSearch(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Button onClick={handleFilter}>Filter</Button>
      </div>
    </div>
  );
}
