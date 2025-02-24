// components/trader-card.tsx
"use client";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { type Trader } from "@/lib/types";
import { useState } from "react";

interface TraderCardProps extends Trader {
  onEdit?: (trader: Trader) => void;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export function EditPage({
  id,
  name,
  imageUrl,
  followers,
  minCapital,
  percentageProfit,
  totalProfit,
  rating,
  isPro,
  onEdit,
  onDelete,
  isAdmin = false
}: TraderCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [investmentAmount, setInvestmentAmount] = useState(minCapital);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card rounded-xl p-6 shadow-lg relative"
    >
      {isPro && (
        <div className="absolute top-4 right-4 bg-premium text-premium-foreground px-3 py-1 rounded-full text-sm">
          PRO
        </div>
      )}

      <div className="flex flex-col items-center gap-4">
        <motion.div whileHover={{ scale: 1.05 }} className="relative">
          <img
            src={imageUrl}
            alt={name}
            className="w-24 h-24 rounded-full border-2 border-primary object-cover"
          />
        </motion.div>

        <h3 className="text-xl font-semibold">{name}</h3>

        <div className="grid grid-cols-2 gap-4 w-full">
          <Stat label="Followers" value={followers.toLocaleString()} />
          <Stat label="Min Capital" value={`$${minCapital.toLocaleString()}`} />
          <Stat label="Profit %" value={`${percentageProfit}%`} />
          <Stat label="Total Profit" value={`$${totalProfit.toLocaleString()}`} />
        </div>

        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < rating ? "text-primary fill-primary" : "text-muted"}`}
            />
          ))}
        </div>

        {isAdmin ? (
          <div className="flex gap-2 w-full">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => onEdit?.({
                id,
                name,
                imageUrl,
                followers,
                minCapital,
                percentageProfit,
                totalProfit,
                rating,
                isPro,
                createdAt: new Date(),
                updatedAt: new Date()
              })}
            >
              Edit
            </Button>
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => onDelete?.(id)}
            >
              Delete
            </Button>
          </div>
        ) : (
          <Button className="w-full" onClick={() => setIsDialogOpen(true)}>
            Copy Trade
          </Button>
        )}
      </div>

      <TradeDialog
        isOpen={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        minCapital={minCapital}
        percentageProfit={percentageProfit}
        amount={investmentAmount}
        setAmount={setInvestmentAmount}
      />
    </motion.div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

function TradeDialog({
  isOpen,
  onOpenChange,
  minCapital,
  percentageProfit,
  amount,
  setAmount
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  minCapital: number;
  percentageProfit: number;
  amount: number;
  setAmount: (value: number) => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Trade</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Input
            type="number"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            min={minCapital}
            placeholder="Investment amount"
          />
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Minimum Capital:</span>
              <span>${minCapital.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Success Rate:</span>
              <span>{percentageProfit}%</span>
            </div>
          </div>

          <Button className="w-full">Confirm Trade</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
