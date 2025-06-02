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
import { Input } from "@/components/ui/input"; // Added Input
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose, // Added DialogClose
} from "@/components/ui/dialog"; // Added Dialog components
import { formatDistanceToNow } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query"; // Added useQueryClient
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
  const queryClient = useQueryClient(); // Added for refetching

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvestment, setSelectedInvestment] = useState<InvestmentItem | null>(null);
  const [profitAmount, setProfitAmount] = useState<string>("");

  // State to track actioned rows for disabling
  const [actionedRows, setActionedRows] = useState<Set<string>>(new Set());

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

  const [pendingPayouts, setPendingPayouts] = useState<Set<string>>(new Set()); // This might be adapted or replaced by modal's loading state
  const [completedPayouts, setCompletedPayouts] = useState<Set<string>>(new Set()); // This might be replaced by actionedRows

  // Adjusted to accept amount and handle UI updates
  const handleAddProfit = async (userInvestmentId: string, amount: number) => {
    if (!selectedInvestment) return;
    // We'll use a new state for loading within the modal for specific actions
    // For now, let's assume the mutation hook handles its own loading state display if needed
    try {
      // IMPORTANT: The useAddInvestmentProfit hook and its API endpoint
      // must be able to accept an object with { userInvestmentId, amount }
      // or similar structure that includes the custom profit amount.
      // This is an assumption for the frontend change.
      await addProfitMutation.mutateAsync({ userInvestmentId, amount }, {
        onSuccess: () => {
          setActionedRows(prev => new Set(prev).add(userInvestmentId));
          setIsModalOpen(false);
          setSelectedInvestment(null);
          setProfitAmount("");
          queryClient.invalidateQueries({ queryKey: ["userInvestments", page, search] });
          // Add toast notification for success
        },
        onError: (error) => {
          console.error("Error adding profit:", error);
          // Add toast notification for error
        }
      });
    } catch (error) {
      console.error("Error initiating add profit mutation:", error);
      // Add toast notification for error
    }
  };

  const handleDelete = async (id: string) => {
    if (!selectedInvestment) return;
    try {
      await deleteInvestmentMutation.mutateAsync(id, {
        onSuccess: () => {
          setActionedRows(prev => new Set(prev).add(id));
          setIsModalOpen(false);
          setSelectedInvestment(null);
          queryClient.invalidateQueries({ queryKey: ["userInvestments", page, search] });
          // Add toast notification for success
        },
        onError: (error) => {
          console.error("Error deleting investment:", error);
          // Add toast notification for error
        }
      });
    } catch (error) {
      console.error("Error initiating delete mutation:", error);
      // Add toast notification for error
    }
  };

  // Placeholder for Decline action
  const handleDecline = async (id: string) => {
    if (!selectedInvestment) return;
    console.log(`Investment ${id} declined.`);
    // Here you would typically call a mutation to mark the investment as declined on the backend.
    // For now, we'll just update the UI.
    setActionedRows(prev => new Set(prev).add(id));
    setIsModalOpen(false);
    setSelectedInvestment(null);
    queryClient.invalidateQueries({ queryKey: ["userInvestments", page, search] });
    // Add toast notification for success/info
  };

  const openModalWithInvestment = (item: InvestmentItem) => {
    setSelectedInvestment(item);
    setProfitAmount(""); // Reset profit amount when opening modal
    setIsModalOpen(true);
  };

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
            <TableRow 
              key={item.id} 
              className={`transition-opacity duration-300 ease-in-out ${actionedRows.has(item.id) ? "opacity-30 pointer-events-none" : "hover:bg-yellow-100"}`}
            >
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
                   className="bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-700 dark:hover:bg-blue-800"
                   onClick={() => openModalWithInvestment(item)}
                   disabled={actionedRows.has(item.id)}
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {/* Modal Implementation will go here */}
      {selectedInvestment && (
        <Dialog open={isModalOpen} onOpenChange={(open) => {
          if (!open) {
            setSelectedInvestment(null);
            setProfitAmount("");
          }
          setIsModalOpen(open);
        }}>
          <DialogContent className="sm:max-w-[525px] bg-white dark:bg-gray-900 shadow-2xl rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-gray-900 dark:text-gray-100">Manage Investment</DialogTitle>
              <DialogDescription className="text-gray-600 dark:text-gray-400">
                Review and manage the investment for {selectedInvestment.user.fullName} ({selectedInvestment.user.email}).
                <br />
                Investment: {selectedInvestment.investment.name} - Amount: ${selectedInvestment.amount.toLocaleString()}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="profitAmount" className="text-right col-span-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profit Amount
                </label>
                <Input 
                  id="profitAmount" 
                  type="number"
                  value={profitAmount}
                  onChange={(e) => setProfitAmount(e.target.value)}
                  placeholder="Enter profit amount"
                  className="col-span-3 dark:bg-gray-800 dark:text-gray-200 dark:border-gray-700"
                />
              </div>
            </div>
            <DialogFooter className="sm:justify-between gap-2">
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(selectedInvestment.id)}
                disabled={deleteInvestmentMutation.isPending}
                className="disabled:opacity-50"
              >
                {deleteInvestmentMutation.isPending && deleteInvestmentMutation.variables === selectedInvestment.id ? "Deleting..." : "Delete Investment"}
              </Button>
              <div className="space-x-2">
                <Button 
                  variant="outline"
                  onClick={() => handleDecline(selectedInvestment.id)}
                  className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                >
                  Decline
                </Button>
                <Button 
                  type="button" // Changed from submit if not in a form
                  onClick={() => {
                    const amount = parseFloat(profitAmount);
                    if (isNaN(amount) || amount <= 0) {
                      // Add toast error: Invalid profit amount
                      alert("Please enter a valid positive profit amount.");
                      return;
                    }
                    handleAddProfit(selectedInvestment.id, amount);
                  }}
                  disabled={addProfitMutation.isPending}
                  className="bg-green-500 hover:bg-green-600 text-white disabled:opacity-50 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  {addProfitMutation.isPending ? "Processing..." : "Payout Profit"}
                </Button>
              </div>
            </DialogFooter>
            <DialogClose asChild>
                <Button type="button" variant="ghost" className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground dark:text-gray-400 dark:hover:text-gray-100">
                    <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='18' y1='6' x2='6' y2='18'></line><line x1='6' y1='6' x2='18' y2='18'></line></svg>
                    <span className="sr-only">Close</span>
                </Button>
            </DialogClose>
          </DialogContent>
        </Dialog>
      )}
      <div className="flex items-center justify-between p-4 bg-yellow-100 dark:bg-gray-800">
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
