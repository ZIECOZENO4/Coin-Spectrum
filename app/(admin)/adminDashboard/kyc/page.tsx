// app/admin/kyc/page.tsx
"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { formatDistanceToNow } from "date-fns";
import { useDebounce } from "@/hook/useDebounce";

export default function KycPage() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [selectedKyc, setSelectedKyc] = useState<any>(null);
    const [rejectionReason, setRejectionReason] = useState("");
    const debouncedSearch = useDebounce(search, 500);
    const queryClient = useQueryClient();
  
    const { data, isLoading } = useQuery({
      queryKey: ["kyc", page, debouncedSearch],
      queryFn: async () => {
        const params = new URLSearchParams({
          page: page.toString(),
          search: debouncedSearch,
        });
        const res = await fetch(`/api/Adminkyc?${params}`);
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      },
    });
  
    const kycMutation = useMutation({
      mutationFn: async ({ kycId, action, rejectionReason }: any) => {
        const res = await fetch("/api/Adminkyc", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ kycId, action, rejectionReason }),
        });
        if (!res.ok) throw new Error("Failed to process KYC");
        return res.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["kyc"] });
        setSelectedKyc(null);
        setRejectionReason("");
      },
    });
  
    if (isLoading) return <div className="text-white"><Loading /></div>;

  return (
    <div className="min-h-screen bg-black p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col items-center justify-between">
          <h1 className="text-2xl font-bold text-white">KYC Verifications</h1>
          <Input
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs bg-yellow-50 text-black"
          />
        </div>

        <div className="bg-yellow-50 rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-yellow-100">
              <TableRow>
                <TableHead className="text-black font-bold">User</TableHead>
                <TableHead className="text-black font-bold">ID Type</TableHead>
                <TableHead className="text-black font-bold">Documents</TableHead>
                <TableHead className="text-black font-bold">Status</TableHead>
                <TableHead className="text-black font-bold">Submitted</TableHead>
                <TableHead className="text-black font-bold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.kycList.map((item: any) => (
                <TableRow key={item.kyc.id} className="hover:bg-yellow-100">
                  <TableCell className="text-black">
                    <div className="flex flex-col">
                      <span className="font-medium">{item.user.fullName}</span>
                      <span className="text-sm text-gray-600">{item.kyc.email}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black">{item.kyc.idType}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      {item.kyc.idDocumentUrl && (
                        <a href={item.kyc.idDocumentUrl} target="_blank" rel="noopener noreferrer" 
                           className="text-blue-600 hover:underline block">
                          ID Document
                        </a>
                      )}
                      {item.kyc.proofOfAddressUrl && (
                        <a href={item.kyc.proofOfAddressUrl} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline block">
                          Address Proof
                        </a>
                      )}
                      {item.kyc.selfieUrl && (
                        <a href={item.kyc.selfieUrl} target="_blank" rel="noopener noreferrer"
                           className="text-blue-600 hover:underline block">
                          Selfie
                        </a>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-black">{item.kyc.status}</TableCell>
                  <TableCell className="text-black">
                    {formatDistanceToNow(new Date(item.kyc.createdAt))} ago
                  </TableCell>
                  <TableCell>
                    <div className="space-x-2 flex gap-4">
                      <Button
                        onClick={() => kycMutation.mutate({ 
                          kycId: item.kyc.id, 
                          action: "approve" 
                        })}
                        className="bg-green-600 text-white hover:bg-green-700"
                        disabled={item.kyc.status !== "pending"}
                      >
                        Approve
                      </Button>
                      <Button
                        onClick={() => setSelectedKyc(item.kyc)}
                        className="bg-red-600 text-white hover:bg-red-700"
                        disabled={item.kyc.status !== "pending"}
                      >
                        Reject
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <Dialog open={!!selectedKyc} onOpenChange={() => setSelectedKyc(null)}>
          <DialogContent className="bg-black text-white">
            <DialogHeader>
              <DialogTitle>Reject KYC</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 flex gap-8">
              <Input
                placeholder="Reason for rejection"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="bg-yellow-50 text-black"
              />
              <Button
                onClick={() => {
                  kycMutation.mutate({
                    kycId: selectedKyc?.id,
                    action: "reject",
                    rejectionReason,
                  });
                }}
                className="w-full bg-red-600 hover:bg-red-700"
                disabled={!rejectionReason}
              >
                Confirm Rejection
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex justify-between mt-4">
          <Button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Previous
          </Button>
          <Button
            onClick={() => setPage(p => p + 1)}
            disabled={page === data?.totalPages}
            className="bg-yellow-400 text-black hover:bg-yellow-500"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
