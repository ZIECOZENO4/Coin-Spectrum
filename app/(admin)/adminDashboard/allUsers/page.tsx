// app/admin/users/page.tsx
"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hook/useDebounce";
import { UsersTable } from "./aside";

export default function UsersPage() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex  flex-col gap-4 items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Users Management</h1>
          <Input
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-yellow-50 text-black placeholder:text-gray-500"
          />
        </div>
        <UsersTable search={debouncedSearch} />
      </div>
    </div>
  );
}
