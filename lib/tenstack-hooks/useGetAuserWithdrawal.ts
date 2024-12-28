/**
 * The function `useGetAUserWithdrawal` fetches investment details for a specific user withdrawal using
 * a suspense query in TypeScript.
 * @param  - The code you provided defines a custom hook `useGetAUserWithdrawal` that fetches
 * investment details for a specific user withdrawal using a suspense query in TypeScript.
 * @returns The `useGetAUserWithdrawal` function is being returned. It takes a `id` parameter of type
 * string and returns the result of a `useSuspenseQuery` hook with a specific configuration for
 * fetching investment details related to a user withdrawal.
 */
// /lib/hooks/useInvestment.ts

import { useSuspenseQuery } from "@tanstack/react-query";
// /lib/types.ts

import { Prisma } from "@prisma/client";

export type WithdrawalWithUserDetails = Prisma.WithdrawalGetPayload<{
  include: {
    user: true;
  };
}>;

/**
 * The function `fetchInvestmentDetails` fetches withdrawal details for a user based on the provided
 * ID.
 * @param  - The `fetchInvestmentDetails` function is an asynchronous function that takes an object as
 * a parameter with a `queryKey` property. The `queryKey` property is an array with two elements, where
 * the first element is a string and the second element is either a string or `null`.
 * @returns The function `fetchInvestmentDetails` is returning data of type
 * `WithdrawalWithUserDetails`.
 */
const fetchInvestmentDetails = async ({
  queryKey,
}: {
  queryKey: [string, string | null];
}) => {
  const [, id] = queryKey;

  if (!id) {
    throw new Error("ID is required");
  }

  const response = await fetch(`/api/getAUserwithdrawal?id=${id}`);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Failed to fetch investment details");
  }

  return data as WithdrawalWithUserDetails;
};

/**
 * The function `useGetAUserWithdrawal` fetches investment details for a specific user withdrawal using
 * a suspense query in TypeScript.
 * @param {string} id - The `id` parameter in the `useGetAUserWithdrawal` function is a string that
 * represents the unique identifier of a user's withdrawal. This identifier is used to fetch the
 * specific details of the user's withdrawal from the server.
 * @returns The `useGetAUserWithdrawal` function is being returned. It takes a `id` parameter of type
 * string and returns the result of a `useSuspenseQuery` hook with a specific configuration for
 * fetching investment details related to a user withdrawal.
 */
export const useGetAUserWithdrawal = (id: string) => {
  return useSuspenseQuery({
    queryKey: ["a-user-withdrawal", id],
    queryFn: fetchInvestmentDetails,
  });
};
