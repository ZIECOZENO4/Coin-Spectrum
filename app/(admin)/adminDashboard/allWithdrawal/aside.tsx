// Withdrawals.tsx
"use client";

import { Suspense, useState } from "react";
import { Filter, Plus } from "lucide-react";
import { FaSearch } from "react-icons/fa";
import { Button, buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "./dataTable";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { DrawerDialogDemo } from "@/components/custom-component/drawer-or-dialogue";
import { FilterForm } from "./filterComponent";
import { useWithdrawalDataTableStore } from "@/lib/zuustand-store";
import Loader from "@/components/loader";

const Withdrawals = () => {
  const { setSearch, search } = useWithdrawalDataTableStore();
  const [searchValue, setSearchValue] = useState("");

  const handleSearchClick = () => {
    setSearch(searchValue);
  };

  return (
    <div className="bg-black px-1 py-5 md:px-10">
      <div className="flex items-center justify-between">
        <p className="text-xl font-extrabold text-white">All Withdrawals</p>
        <div></div>
      </div>
      <Separator className="my-4 bg-neutral-900" />

      <div className="py-5">
        <div className="flex items-center py-4">
          <Input
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
            className="max-w-sm"
          />
          <Button
            variant={"ghost"}
            size={"sm"}
            spellCheck
            className="ml-2"
            onClick={handleSearchClick}
          >
            <FaSearch className="h-4 w-4" />
          </Button>
          <DrawerDialogDemo component={FilterForm}>
            <Button variant="outline" className="ml-4 bg-rose-400">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </DrawerDialogDemo>
        </div>
      </div>
      <Suspense
        fallback={
          <Loader className="flex items-center justify-center min-h-[60dvh]" />
        }
      >
        <DataTable />
      </Suspense>
    </div>
  );
};

export default Withdrawals;
