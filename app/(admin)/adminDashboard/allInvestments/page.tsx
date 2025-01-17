// app/admin/investments/page.tsx
"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hook/useDebounce";
import { useEffect, useState } from "react";
import { UserInvestmentsTable } from "./UserInvestmentsTable";

export default function InvestmentsPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Users Investments</h1>
          <Input
            placeholder="Search investments..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-yellow-50 text-black placeholder:text-gray-500"
          />
        </div>
        <UserInvestmentsTable search={debouncedSearch} />
      </div>
    </div>
  );
}
