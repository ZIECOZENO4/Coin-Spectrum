"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getTransactionById } from "@/lib/actions/transactions";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useUser } from "@clerk/nextjs";
import { formatCurrency } from "@/lib/formatCurrency";
import { useSearchParams } from "next/navigation";

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const [transaction, setTransaction] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;
        const data = await getTransactionById(id);
        setTransaction(data);
        
        // Show success toast and confetti for deposits and successful trades
        const isSuccessfulTransaction = 
          data.type === "deposit" || 
          (data.type === "trade" && data.direction === "IN");

        if (isSuccessfulTransaction) {
          toast.success("Transaction Successful! 🎉", {
            description: `Your ${data.type} of ${formatCurrency(data.amount)} has been processed.`,
            duration: 5000,
          });
          
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        // Send email receipt
        await fetch("/api/send-receipt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...data,
            userEmail: user?.emailAddresses[0]?.emailAddress,
            userName: user?.fullName,
          }),
        });

      } catch (error) {
        console.error("Error:", error);
        toast.error("Failed to load transaction details");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  const handleDownload = () => {
    window.print();
    toast.success("Download Started", {
      description: "Your receipt is being downloaded"
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction receipt for ${transaction?.type}`,
          url: window.location.href,
        });
        toast.success("Shared Successfully", {
          description: "Your receipt has been shared"
        });
      } else {
        // Fallback for browsers that don't support sharing
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link Copied", {
          description: "Receipt link copied to clipboard"
        });
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast.error("Failed to share receipt");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Transaction Not Found</h2>
          <p className="text-gray-600">The requested transaction could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full border border-gray-200 relative">
        {/* Company Logo */}
        <div className="flex justify-center mb-4">
          <Image src="/company-logo.png" alt="Company Logo" width={80} height={80} />
        </div>
        {/* Company Details */}
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Digital Fortress Ltd.</h2>
          <p className="text-sm text-gray-500">1234 Main Street, City, Country</p>
          <p className="text-sm text-gray-500">support@digitalfortress.com | +123 456 7890</p>
        </div>
        {/* Receipt Details */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Transaction Receipt</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Transaction ID:</span>
              <span className="font-mono">{transaction.id}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Type:</span>
              <span>{transaction.type}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Description:</span>
              <span>{transaction.description}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Amount:</span>
              <span className={transaction.direction === "IN" ? "text-green-600" : "text-red-600"}>
                {transaction.direction === "IN" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Date:</span>
              <span>{new Date(transaction.createdAt).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Status:</span>
              <span className="text-green-600">Completed</span>
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-between mt-6 gap-4">
          <Button
            onClick={handleDownload}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            Download PDF
          </Button>
          <Button
            onClick={handleShare}
            className="flex-1 bg-secondary hover:bg-secondary/90"
          >
            Share
          </Button>
        </div>
        {/* Official Stamp */}
        <div className="absolute bottom-4 right-4 opacity-30">
          <Image src="/official-stamp.png" alt="Official Stamp" width={80} height={80} />
        </div>
      </div>
    </div>
  );
} 