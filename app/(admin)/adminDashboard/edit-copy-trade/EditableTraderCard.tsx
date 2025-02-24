// components/EditableTraderCard.tsx
"use client";
import { useEffect, useState } from "react";
import { Trader } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface EditableTraderCardProps {
  trader: Trader;
  onSave: (trader: Trader) => void;
  isSaving: boolean;
}

export default function EditableTraderCard({ trader, onSave, isSaving }: EditableTraderCardProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTrader, setEditedTrader] = useState<Trader>({
    id: '',
    name: '',
    imageUrl: '',
    followers: 0,
    minCapital: 0,
    percentageProfit: 0,
    totalProfit: 0,
    rating: 5,
    isPro: false,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  useEffect(() => {
    setIsMounted(true);
    setEditedTrader(trader);
  }, [trader]);

  const handleSave = () => {
    const validatedTrader: Trader = {
      ...editedTrader,
      followers: Number(editedTrader.followers) || 0,
      minCapital: Number(editedTrader.minCapital),
      percentageProfit: Number(editedTrader.percentageProfit),
      totalProfit: Number(editedTrader.totalProfit) || 0,
      rating: Math.min(Math.max(Number(editedTrader.rating), 1), 5)
    };
    
    onSave(validatedTrader);
    setIsEditing(false);
  };

  if (!isMounted) return null;

  return (
    <div className="bg-card rounded-xl p-6 shadow-lg space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">
          {isEditing ? (
            <Input
              value={editedTrader.name}
              onChange={(e) => setEditedTrader({ ...editedTrader, name: e.target.value })}
            />
          ) : (
            trader.name
          )}
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm">Pro Trader</span>
          <Switch
            checked={editedTrader.isPro}
            onCheckedChange={(checked) => setEditedTrader({ ...editedTrader, isPro: checked })}
            disabled={!isEditing}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <EditableField
          label="Followers"
          value={editedTrader.followers}
          isEditing={isEditing}
          onChange={(value) => setEditedTrader({ ...editedTrader, followers: Number(value) })}
          type="number"
        />
        <EditableField
          label="Min Capital"
          value={editedTrader.minCapital}
          isEditing={isEditing}
          onChange={(value) => setEditedTrader({ ...editedTrader, minCapital: Number(value) })}
          type="number"
          prefix="$"
        />
        <EditableField
          label="Profit %"
          value={editedTrader.percentageProfit}
          isEditing={isEditing}
          onChange={(value) => setEditedTrader({ ...editedTrader, percentageProfit: Number(value) })}
          type="number"
          suffix="%"
        />
        <EditableField
          label="Total Profit"
          value={editedTrader.totalProfit}
          isEditing={isEditing}
          onChange={(value) => setEditedTrader({ ...editedTrader, totalProfit: Number(value) })}
          type="number"
          prefix="$"
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${i < editedTrader.rating ? "text-primary fill-primary" : "text-muted"}`}
            />
          ))}
        </div>

        <div className="flex gap-2">
          {isEditing ? (
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save"}
            </Button>
          ) : (
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  isEditing,
  onChange,
  type = "text",
  prefix,
  suffix
}: {
  label: string;
  value: number;
  isEditing: boolean;
  onChange: (value: string) => void;
  type?: "text" | "number";
  prefix?: string;
  suffix?: string;
}) {
  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      {isEditing ? (
        <div className="flex items-center gap-1">
          {prefix && <span>{prefix}</span>}
          <Input
            type={type}
            value={value || 0}
            onChange={(e) => onChange(e.target.value)}
            className="w-full"
          />
          {suffix && <span>{suffix}</span>}
        </div>
      ) : (
        <p className="font-medium">
          {prefix}{(value || 0).toLocaleString()}{suffix}
        </p>
      )}
    </div>
  );
}
