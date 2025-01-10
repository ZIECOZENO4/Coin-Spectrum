// hooks/useReferralData.ts
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/app/api/(user)/getRefferal/types";

async function fetchReferralData({ queryKey }: { queryKey: QueryKey }) {
  const [_key] = queryKey;
  const url = `/api/getRefferal`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: "Failed to fetch referral data"
      }));
      throw new Error(errorData.error || "Internal server error");
    }
    
    return await response.json() as ApiResponse;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("Failed to fetch referral data");
  }
}

export function useReferralData() {
  return useSuspenseQuery({
    queryKey: ["referralData"],
    queryFn: fetchReferralData,
    retry: false
  });
}
