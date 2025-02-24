// app/admin/traders/page.tsx
"use client";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Trader } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import EditableTraderCard from "./EditableTraderCard";

export default function AdminTradersPage() {
  const { data: traders, isLoading, refetch } = useQuery<Trader[]>({
    queryKey: ['admin-traders'],
    queryFn: async () => {
      const res = await fetch("/api/traders");
      if (!res.ok) throw new Error("Failed to fetch traders");
      return res.json();
    }
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedTrader: Trader) => {
      const res = await fetch(`/api/traders/${updatedTrader.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTrader)
      });
      if (!res.ok) throw new Error("Failed to update trader");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Trader updated successfully");
      refetch();
    },
    onError: (error: Error) => toast.error(error.message)
  });

  if (isLoading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-[150px] w-full" />
      ))}
    </div>
  );

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Manage Traders</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {traders?.map((trader) => (
          <EditableTraderCard
            key={trader.id}
            trader={trader}
            onSave={updateMutation.mutate}
            isSaving={updateMutation.isPending}
          />
        ))}
      </div>
    </div>
  );
}
