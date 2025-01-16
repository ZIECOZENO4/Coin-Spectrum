import { Investment } from "@prisma/client";
import {
  useMutation,
  MutationFunction,
  MutationKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Hook (addAnewInvestment.ts)
interface CreateInvestmentData {
  id: string; // Investment plan ID
  amount: number;
  // Optional fields
  userName?: string;
  userEmail?: string;
  imageUrl?: string;
  imageId?: string;
}

const createInvestment: MutationFunction<Investment, CreateInvestmentData> = async (data) => {
  console.log("Starting investment creation...");
  console.log("Sending data to API:", data);

  try {
    const response = await fetch("/api/addAnInvestment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        id: data.id,
        amount: data.amount,
        // Include optional fields only if they exist
        ...(data.userName && { userName: data.userName }),
        ...(data.userEmail && { userEmail: data.userEmail }),
        ...(data.imageUrl && { imageUrl: data.imageUrl }),
        ...(data.imageId && { imageId: data.imageId })
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create investment");
    }

    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.error("Investment creation failed:", error);
    throw error;
  }
};

export const useCreateInvestment = () => {
  return useMutation({
    mutationFn: createInvestment,
    mutationKey: ["createInvestment"],
    onSuccess: (data) => {
      toast.success("Investment created successfully!");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create investment");
    }
  });
};

// API Route (api/addAnInvestment/route.ts)
