import { CreateInvestmentData } from "@/app/api/(user)/addAnInvestment/route";
import { Investment } from "@prisma/client";
import {
  useMutation,
  MutationFunction,
  MutationKey,
} from "@tanstack/react-query";
import { toast } from "sonner";


const createInvestment: MutationFunction<
  Investment,
  CreateInvestmentData
> = async (data) => {
  console.log("Sending data to API:", data);

  const response = await fetch("/api/addAnInvestment", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorResponse = await response.json();
    throw new Error(errorResponse.error || "Error creating investment");
  }

  const responseData = await response.json();
  console.log("Response from API:", responseData);

  return responseData;
};

export const useCreateInvestment = () => {
  const mutationKey: MutationKey = ["createInvestment"];

  return useMutation({
    mutationFn: createInvestment,
    mutationKey,
    onMutate: () => {
      console.log("Mutation started");
    },
    onSuccess: (data) => {
      console.log("Mutation succeeded:", data);
      toast.success("Investment created successfully!");
    },
    onError: (error: any) => {
      console.error("Mutation failed:", error);
      toast.error(`Error: ${error.message}`);
    },
  });
};
