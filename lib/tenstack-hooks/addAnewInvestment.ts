import { Investment } from "@prisma/client";
import {
  useMutation,
  MutationFunction,
  MutationKey,
} from "@tanstack/react-query";
import { toast } from "sonner";

// Define the interface based on the API requirements
interface CreateInvestmentData {
  userName: string;
  userEmail: string;
  transactionId: string;
  id: string;
  amount: number;
  imageUrl: string;
  imageId: string;
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
        userName: data.userName,
        userEmail: data.userEmail,
        transactionId: data.transactionId,
        id: data.id,
        amount: data.amount,
        imageUrl: data.imageUrl,
        imageId: data.imageId
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create investment");
    }

    const responseData = await response.json();
    console.log("Investment created successfully:", responseData);
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
    onMutate: (variables) => {
      console.log("Starting investment creation with:", variables);
    },
    onSuccess: (data) => {
      console.log("Investment created successfully:", data);
      toast.success("Investment created successfully!");
    },
    onError: (error: Error) => {
      console.error("Investment creation failed:", error);
      toast.error(error.message || "Failed to create investment");
    }
  });
};
