"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ReasonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (reason: string) => void;
  action: "ban" | "unban" | "delete";
  userEmail: string;
  userName: string;
  isLoading?: boolean;
}

export function ReasonDialog({
  open,
  onOpenChange,
  onConfirm,
  action,
  userEmail,
  userName,
  isLoading = false,
}: ReasonDialogProps) {
  const [reason, setReason] = useState("");
  const [selectedPreset, setSelectedPreset] = useState("");

  const handleConfirm = () => {
    const finalReason = selectedPreset || reason.trim();
    if (finalReason) {
      onConfirm(finalReason);
      setReason("");
      setSelectedPreset("");
    }
  };

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value);
    setReason(""); // Clear custom reason when preset is selected
  };

  const handleCustomReasonChange = (value: string) => {
    setReason(value);
    setSelectedPreset(""); // Clear preset when custom reason is entered
  };

  const getActionText = () => {
    switch (action) {
      case "ban":
        return "Ban User";
      case "unban":
        return "Unban User";
      case "delete":
        return "Delete User";
      default:
        return "Action";
    }
  };

  const getDescription = () => {
    switch (action) {
      case "ban":
        return `You are about to ban ${userName} (${userEmail}). Please provide a reason for this action.`;
      case "unban":
        return `You are about to unban ${userName} (${userEmail}). Please provide a reason for this action.`;
      case "delete":
        return `You are about to permanently delete ${userName} (${userEmail}) and all their data. This action cannot be undone. Please provide a reason for this action.`;
      default:
        return "Please provide a reason for this action.";
    }
  };

  const getPlaceholder = () => {
    switch (action) {
      case "ban":
        return "e.g., Violation of terms of service, suspicious activity, inappropriate behavior...";
      case "unban":
        return "e.g., Issue resolved, false positive, user has been cooperative...";
      case "delete":
        return "e.g., Account closure requested, data breach concerns, policy violation...";
      default:
        return "Please provide a detailed reason...";
    }
  };

  const getPresetReasons = () => {
    switch (action) {
      case "ban":
        return [
          {
            value: "Dormant account - No activity for extended period",
            label: "Dormant Account",
            description: "Account has been inactive for an extended period"
          },
          {
            value: "Lack of deposits - No deposits made to the account",
            label: "Lack of Deposits",
            description: "User has not made any deposits to their account"
          },
          {
            value: "Terms of service violation",
            label: "Terms Violation",
            description: "User violated platform terms of service"
          },
          {
            value: "Suspicious activity detected",
            label: "Suspicious Activity",
            description: "Unusual or suspicious account behavior detected"
          },
          {
            value: "Inappropriate behavior",
            label: "Inappropriate Behavior",
            description: "User engaged in inappropriate conduct"
          }
        ];
      case "unban":
        return [
          {
            value: "Issue resolved - User has addressed concerns",
            label: "Issue Resolved",
            description: "User has addressed the previous concerns"
          },
          {
            value: "False positive - Account was incorrectly flagged",
            label: "False Positive",
            description: "Account was incorrectly flagged by system"
          },
          {
            value: "User cooperation - User has been cooperative",
            label: "User Cooperation",
            description: "User has been cooperative in resolving issues"
          }
        ];
      case "delete":
        return [
          {
            value: "Account closure requested by user",
            label: "User Requested",
            description: "User specifically requested account deletion"
          },
          {
            value: "Data breach concerns",
            label: "Data Breach",
            description: "Account deletion due to data security concerns"
          },
          {
            value: "Policy violation - Severe breach",
            label: "Severe Policy Violation",
            description: "Account deleted due to severe policy violations"
          }
        ];
      default:
        return [];
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle className="text-red-600 font-bold">
            {getActionText()}
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {getDescription()}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* Preset Reasons */}
          <div className="grid gap-2">
            <Label className="text-sm font-medium">
              Select a reason (or write custom below)
            </Label>
            <RadioGroup 
              value={selectedPreset} 
              onValueChange={handlePresetChange}
              className="space-y-2"
            >
              {getPresetReasons().map((preset) => (
                <div key={preset.value} className="flex items-start space-x-2">
                  <RadioGroupItem 
                    value={preset.value} 
                    id={preset.value}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label 
                      htmlFor={preset.value}
                      className="text-sm font-medium cursor-pointer"
                    >
                      {preset.label}
                    </Label>
                    <p className="text-xs text-gray-500 mt-1">
                      {preset.description}
                    </p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Custom Reason */}
          <div className="grid gap-2">
            <Label htmlFor="reason" className="text-sm font-medium">
              Or write a custom reason
            </Label>
            <Textarea
              id="reason"
              placeholder={getPlaceholder()}
              value={reason}
              onChange={(e) => handleCustomReasonChange(e.target.value)}
              className="min-h-[100px] resize-none"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={(!reason.trim() && !selectedPreset) || isLoading}
            className={
              action === "delete"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : action === "ban"
                ? "bg-orange-600 hover:bg-orange-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }
          >
            {isLoading ? "Processing..." : `Confirm ${getActionText()}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
