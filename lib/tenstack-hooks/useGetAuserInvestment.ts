// /lib/hooks/useInvestment.ts

import { useSuspenseQuery } from "@tanstack/react-query";
// /lib/types.ts

import { Prisma } from "@prisma/client";

export type InvestmentWithDetails = Prisma.InvestmentGetPayload<{
  include: {
    imageProofUrl: true;
    plan: true;
    user: true;
    status: true;
  };
}>;

const fetchInvestmentDetails = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [, id] = queryKey;

  if (!id) {
    throw new Error("ID is required");
  }

  const response = await fetch(`/api/getAuserInvestment?id=${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch investment details");
  }

  return data as InvestmentWithDetails;
};

export const useAUserInvestment = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["a-user-investment", id],
    queryFn: fetchInvestmentDetails,
  });
};
