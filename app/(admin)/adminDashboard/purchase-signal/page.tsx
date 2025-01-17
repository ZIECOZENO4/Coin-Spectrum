// app/admin/signals/page.tsx
"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateSignal } from "@/hook/useSignals";
import { Textarea } from "@/components/ui/textarea";

export default function CreateSignalPage() {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    percentage: "",
    expiry: "",
    risk: "",
    description: "",
  });

  const createSignalMutation = useCreateSignal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.percentage || !formData.expiry || !formData.risk || !formData.description) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      await createSignalMutation.mutateAsync({
        name: formData.name,
        price: parseFloat(formData.price),
        percentage: parseFloat(formData.percentage),
        expiry: formData.expiry,
        risk: formData.risk as "Low" | "Medium" | "High",
        description: formData.description,
      });

      toast.success("Signal created successfully");
      setFormData({
        name: "",
        price: "",
        percentage: "",
        expiry: "",
        risk: "",
        description: "",
      });
    } catch (error) {
      toast.error("Failed to create signal");
    }
  };

  return (
    <div className="min-h-screen bg-black p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <h1 className="text-3xl font-bold text-white mb-8">Create Trading Signal</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input
              placeholder="Signal Name (e.g., EURUSD Long)"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="bg-zinc-900 border-yellow-400/20 text-white"
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                type="number"
                placeholder="Price ($)"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="bg-zinc-900 border-yellow-400/20 text-white"
              />

              <Input
                type="number"
                placeholder="Expected Return (%)"
                value={formData.percentage}
                onChange={(e) => setFormData(prev => ({ ...prev, percentage: e.target.value }))}
                className="bg-zinc-900 border-yellow-400/20 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder="Expiry (e.g., 24h)"
                value={formData.expiry}
                onChange={(e) => setFormData(prev => ({ ...prev, expiry: e.target.value }))}
                className="bg-zinc-900 border-yellow-400/20 text-white"
              />

              <Select
                value={formData.risk}
                onValueChange={(value) => setFormData(prev => ({ ...prev, risk: value }))}
              >
                <SelectTrigger className="bg-zinc-900 border-yellow-400/20 text-white">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-yellow-400/20">
                  <SelectItem value="Low">Low</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Textarea
              placeholder="Signal Description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-zinc-900 border-yellow-400/20 text-white h-24"
            />

      
          </div>

          <Button
            type="submit"
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
            disabled={createSignalMutation.isPending}
          >
            {createSignalMutation.isPending ? "Creating Signal..." : "Create Signal"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
