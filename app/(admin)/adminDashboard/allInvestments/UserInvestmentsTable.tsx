// app/admin/investments/UserInvestmentsTable.tsx
"use client";
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/app/loading";
// Added imports for action hooks and dialog (if you want to add a confirmation dialog later)
import { useDeleteUserInvestment } from "@/lib/tenstack-hooks/useAdminInvestments";
import { useAddInvestmentProfit } from "@/lib/tenstack-hooks/useAddInvestmentProfit";
import { InvestmentNameEnum } from "@/lib/db/schema"; // Assuming this might be needed for type consistency or future use

interface UserInvestmentsTableProps {
  search: string;
}

// Define a type for the investment item, similar to UserInvestmentData in DataTable.tsx
// This helps with type safety for the 'item' in the map function and action handlers.
// You might need to adjust this based on the actual structure of 'item.user' and 'item.investment'
// if it differs from what was in DataTable.tsx's UserInvestmentData.
export type InvestmentItem = {
  id: string;
  userId: string;
  user: {
    fullName: string;
    email: string;
  };
  investment: {
    id: string;
    name: InvestmentNameEnum; // Or string if InvestmentNameEnum is not directly applicable here
    // Add other investment properties if needed by actions
  };
  amount: number;
  createdAt: string;
  // Add other properties if needed
};

export function UserInvestmentsTable({ search }: UserInvestmentsTableProps) {
  const [page, setPage] = useState(1);
  // const { data, isLoading } = useQuery<any, Error, { investments: InvestmentItem[], totalPages: number }>({ // Typed data
  // It's better to type the response of useQuery if possible
  const { data, isLoading } = useQuery({
    queryKey: ["userInvestments", page, search],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        search,
      });
      const res = await fetch(`/api/user-investments?${params}`);
      if (!res.ok) throw new Error("Failed to fetch user investments");
      return res.json(); // Consider adding a type assertion here e.g., res.json() as { investments: InvestmentItem[], totalPages: number }
    },
  });

  const deleteInvestmentMutation = useDeleteUserInvestment();
  const addProfitMutation = useAddInvestmentProfit();

  const [pendingPayouts, setPendingPayouts] = useState<Set<string>>(new Set());
  const [completedPayouts, setCompletedPayouts] = useState<Set<string>>(new Set());

  const handleDelete = async (id: string) => {
    // Consider adding a confirmation dialog here before deleting
    try {
      await deleteInvestmentMutation.mutateAsync(id);
      // Optionally, refetch data or update UI
    } catch (error) {
      console.error("Error deleting investment:", error);
      // Handle error display to user
    }
  };

  const handleAddProfit = async (userInvestmentId: string) => {
    setPendingPayouts(prev => new Set(prev).add(userInvestmentId));
    try {
      await addProfitMutation.mutateAsync(userInvestmentId, {
        onSuccess: () => {
          setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
          setCompletedPayouts(prev => new Set(prev).add(userInvestmentId));
          // Optionally, refetch data or update UI
        },
        onError: (error) => {
          console.error("Error adding profit:", error);
          setPendingPayouts(prev => {
            const newState = new Set(prev);
            newState.delete(userInvestmentId);
            return newState;
          });
          // Handle error display to user
        }
      });
    } catch (error) {
      console.error("Error initiating add profit mutation:", error);
      setPendingPayouts(prev => {
        const newState = new Set(prev);
        newState.delete(userInvestmentId);
        return newState;
      });
    }
  };

  if (isLoading) return <div className="text-white"><Loading /></div>;
  // Handle case where data might be undefined or data.investments is not an array
  if (!data || !Array.isArray(data.investments)) {
    return <div className="text-black p-4">No investments found or error loading data.</div>;
  }

  return (
    <div className="bg-yellow-50 rounded-lg overflow-hidden">
      <Table>
        <TableHeader className="bg-yellow-100">
          <TableRow>
            <TableHead className="text-black font-bold">User</TableHead>
            <TableHead className="text-black font-bold">Investment</TableHead>
            <TableHead className="text-black font-bold">Amount</TableHead>
            <TableHead className="text-black font-bold">Date</TableHead>
            <TableHead className="text-black font-bold">Actions</TableHead> {/* Added Actions Header */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.investments.map((item: InvestmentItem) => ( // Use the InvestmentItem type
            <TableRow key={item.id} className="hover:bg-yellow-100">
              <TableCell className="text-black">
                <div className="flex flex-col">
                  <span className="font-medium">{item.user.fullName}</span>
                  <span className="text-sm text-gray-600">{item.user.email}</span>
                </div>
              </TableCell>
              <TableCell className="text-black font-medium">
                {item.investment.name}
              </TableCell>
              <TableCell className="text-black">
                ${item.amount.toLocaleString()}
              </TableCell>
              <TableCell className="text-black">
                {formatDistanceToNow(new Date(item.createdAt))} ago
              </TableCell>
              <TableCell className="text-black space-x-2"> {/* Actions Cell with new buttons */}
                <Button 
                   variant="outline" 
                   size="sm"
                   className="bg-green-500 text-white hover:bg-green-600 disabled:opacity-50"
                   onClick={() => handleAddProfit(item.id)}
                   disabled={pendingPayouts.has(item.id) || completedPayouts.has(item.id)}
                >
                  {pendingPayouts.has(item.id) 
                     ? "Sending..." 
                     : completedPayouts.has(item.id) 
                       ? "Profit Sent" 
                       : "Send Profit"}
                </Button>
                <Button 
                   variant="destructive" // More appropriate variant for delete
                   size="sm"
                   className="hover:bg-red-700 disabled:opacity-50"
                   onClick={() => handleDelete(item.id)}
                   disabled={deleteInvestmentMutation.isPending} // Disable while deleting this specific item if needed, or use a general loading state
                >
                  {deleteInvestmentMutation.isPending && deleteInvestmentMutation.variables === item.id 
                     ? "Deleting..." 
                     : "Delete"}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between p-4 bg-yellow-100">
        <div className="text-sm text-black">
          Page {page} of {data?.totalPages || 1}
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-black text-yellow-50 hover:bg-gray-800"
          >
            Previous
          </Button>
          <Button
            variant="outline"
            onClick={() => setPage(p => p + 1)}
            disabled={page === data?.totalPages}
            className="bg-black text-yellow-50 hover:bg-gray-800"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
