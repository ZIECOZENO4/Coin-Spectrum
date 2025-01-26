// app/admin/traders/page.tsx
"use client";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { UploadButton } from "@/lib/uploadthing";
import Image from "next/image";

export default function AdminTradersPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    imageUrl: "",
    followers: 0,
    minCapital: 0,
    percentageProfit: 0,
    totalProfit: 0,
    rating: 5,
    isPro: false
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await fetch("/api/traders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error("Failed to create trader");
      }

      toast.success("Trader created successfully");
      router.refresh();
      
      // Reset form
      setFormData({
        name: "",
        imageUrl: "",
        followers: 0,
        minCapital: 0,
        percentageProfit: 0,
        totalProfit: 0,
        rating: 5,
        isPro: false
      });

    } catch (error) {
      toast.error("Failed to create trader");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold mb-6">Create New Trader</h1>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="div">
                <label>Trader Name</label>
              <Input
                placeholder="Trader Name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  name: e.target.value
                }))}
              /> 
                </div>
                      <div className="div">
    <label>Trader Image</label>
    <div className="mt-2 space-y-4">
    {formData.imageUrl && (
  <Image 
    src={formData.imageUrl} 
    alt="Trader image"
    width={200}
    height={200}
    style={{ objectFit: "cover" }}
    className="rounded-lg"
  />
)}

      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          if (res?.[0]) {
            setFormData(prev => ({
              ...prev,
              imageUrl: res[0].url
            }));
            toast.success("Image uploaded successfully");
          }
        }}
        onUploadError={(error: Error) => {
          toast.error(`Upload failed: ${error.message}`);
        }}
      />
    </div>
  </div>

             
                 <div className="div">
                 <label>Followers</label>
              <Input
                type="number"
                placeholder="Followers"
                value={formData.followers}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  followers: parseInt(e.target.value)
                }))}
              />
                    </div>
           
                 <div className="div">
                 <label>Minimum Capital</label>
              <Input
                type="number"
                placeholder="Minimum Capital"
                value={formData.minCapital}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  minCapital: parseFloat(e.target.value)
                }))}
              />
                    </div>
           
                 <div className="div">
                 <label>Percentage Profit</label>
              <Input
                type="number"
                placeholder="Percentage Profit"
                value={formData.percentageProfit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  percentageProfit: parseFloat(e.target.value)
                }))}
              />
                    </div>
            
                 <div className="div">
                 <label>Total Profit</label>
              <Input
                type="number"
                placeholder="Total Profit"
                value={formData.totalProfit}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  totalProfit: parseFloat(e.target.value)
                }))}
              />
                    </div>
           
                 <div className="div">
                 <label>Rating (1-5)</label>
              <Input
                type="number"
                min="1"
                max="5"
                placeholder="Rating (1-5)"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  rating: parseInt(e.target.value)
                }))}
              />
                    </div>
         
              
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPro}
                  onCheckedChange={(checked) => setFormData(prev => ({
                    ...prev,
                    isPro: checked
                  }))}
                />
                <span>Pro Trader</span>
              </div>
            </div>

            <Button type="submit" className="w-full">
              Create Trader
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
