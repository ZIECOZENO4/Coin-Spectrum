// hooks/useReferralData.ts
import { QueryKey, useSuspenseQuery } from "@tanstack/react-query";
import { ApiResponse } from "@/app/api/(user)/getRefferal/types";

async function fetchReferralData({ queryKey }: { queryKey: QueryKey }) {
  const [_key] = queryKey;
  const url = `/api/getRefferal`;
  const response = await fetch(url);

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
  }

  const data: ApiResponse = await response.json();
  return data;
}

export function useReferralData() {
  return useSuspenseQuery({
    queryKey: ["referralData"],
    queryFn: fetchReferralData,
  });
}
