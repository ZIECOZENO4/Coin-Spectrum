"use client";

import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { useUser } from "@clerk/nextjs";
import { formatCurrency } from "@/lib/formatCurrency";
import { useSearchParams } from "next/navigation";
import html2pdf from "html2pdf.js";

export default function ReceiptPage() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const type = searchParams.get("type");
  const amount = searchParams.get("amount");
  const description = searchParams.get("description");
  const date = searchParams.get("date");
  const { user } = useUser();
  const receiptRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    // Show success toast and confetti for deposits and successful trades
    const isSuccessfulTransaction = 
      type === "deposit" || 
      (type === "trade" && description?.includes("win"));

    if (isSuccessfulTransaction) {
      toast.success("Transaction Successful! 🎉", {
        description: `Your ${type} of ${formatCurrency(Number(amount))} has been processed.`,
        duration: 5000,
      });
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [type, amount, description]);

  const handleDownload = () => {
    if (receiptRef.current) {
      html2pdf()
        .set({
          margin: 0,
          filename: `receipt-${id}.pdf`,
          html2canvas: { scale: 2 },
          jsPDF: { unit: "in", format: "letter", orientation: "portrait" }
        })
        .from(receiptRef.current)
        .save();
    }
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "Transaction Receipt",
          text: `Transaction receipt for ${type}`,
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

  if (!id || !type || !amount || !description || !date) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Invalid Receipt</h2>
          <p className="text-gray-600">Missing required transaction details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  py-8">
      <div ref={receiptRef} className="bg-black p-8 rounded-lg shadow-lg max-w-lg w-full border border-slate-800 relative text-white">
        <div className="flex justify-center mb-4">
          <Image src="/images/cs.png" alt="Company Logo" width={80} height={80} />
        </div>
        <div className="text-center mb-6">
          <h2 className="text-xl font-bold">Digital Fortress Ltd.</h2>
          <p className="text-sm text-gray-500">14331 SW 120TH ST MIAMI, FL 33186</p>
          <p className="text-sm text-gray-500">support@digitalfortress.com | +140 935 8533</p>
        </div>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-2">Transaction Receipt</h3>
          <div className="text-sm space-y-2">
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Transaction ID:</span>
              <span className="font-mono">{id}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Type:</span>
              <span>{type}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Description:</span>
              <span>{description}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Amount:</span>
              <span className={description?.includes("win") ? "text-green-600" : "text-red-600"}>
                {formatCurrency(Number(amount))}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Date:</span>
              <span>{new Date(date).toLocaleString()}</span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-gray-100">
              <span className="font-medium">Status:</span>
              <span className="text-green-600">Completed</span>
            </div>
          </div>
        </div>
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
        <div className="absolute bottom-4 right-4 opacity-30">
          <Image src="/images/stamp.png" alt="Official Stamp" width={80} height={80} className="rounded-full" />
        </div>
      </div>
    </div>
  );
} 