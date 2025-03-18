

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useProcessWithdrawal } from "@/lib/tenstack-hooks/useProcessWithdrawal";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cryptocurrencies } from "../deposit/plans/makePayment/cryptoCurrencies";
import React from "react";
import { DrawerDialogDemo } from "./drawer-or-alert";
import { ConfirmWithdrawal } from "./confirmWithdrawal";
import { motion, AnimatePresence } from "framer-motion";


export const formSchema = z.object({
  withdrawalAmount: z.coerce.number().positive(), // Remove .gte(1)
  walletAddress: z.string().min(10).max(255),
  cryptoType: z.string().min(1)
});

const fetchEligibility = async () => {
  const response = await fetch('/api/checkWithdrawalEligibility');
  if (!response.ok) throw new Error('Eligibility check failed');
  return response.json();
};

export function WithdrawalInput() {
  const processWithdrawal = useProcessWithdrawal();
  const queryClient = useQueryClient();
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = React.useState(false);
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      withdrawalAmount: 0,
      walletAddress: "",
      cryptoType: "",
    },
  });

  const [eligibilityData, setEligibilityData] = React.useState<{
    isEligible: boolean;
    tradeCount: number;
    requirementStatus: string;
    isManualOverride?: boolean;  // Add optional flag
  }>({
    isEligible: false,
    tradeCount: 0,
    requirementStatus: 'unfulfilled',
    isManualOverride: false  // Initialize with default value
  });
  
  React.useEffect(() => {
    const checkInitialEligibility = async () => {
      try {
        const data = await fetchEligibility();
        setEligibilityData({
          isEligible: data.isEligible,
          tradeCount: data.tradeCount,
          requirementStatus: data.requirementStatus,
          isManualOverride: data.isManualOverride || false
        });
      } catch (error) {
        console.error("Initial eligibility check failed:", error);
      }
    };
    checkInitialEligibility();
  }, []);
  

  const remainingTrades = Math.max(3 - eligibilityData.tradeCount, 0);

  const handleDialogOpen = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      setIsDialogOpen(false);
      return;
    }

    try {
      const { isEligible, tradeCount, requirementStatus } = await fetchEligibility();
      setEligibilityData({ isEligible, tradeCount, requirementStatus });
      
      if (!isEligible) {
        const message = requirementStatus === "unfulfilled" 
          ? `Requires ${remainingTrades} more trade${remainingTrades !== 1 ? 's' : ''} (${tradeCount}/3)`
          : "Withdrawal approval pending";
        
        toast.error(message, {
          action: { label: "Refresh", onClick: () => window.location.reload() },
        });
        setIsDialogOpen(false);
        return;
      }

      setIsDialogOpen(true);
      toast.success(`Verified trades: ${tradeCount}. Confirm withdrawal details.`);

    } catch (error) {
      toast.error("Withdrawal validation failed");
      console.error(error);
      setIsDialogOpen(false);
    }
  };

  React.useEffect(() => {
    if (isConfirmed) {
      const executeSubmission = async () => {
        const isValid = await form.trigger();
        if (!isValid) {
          setIsConfirmed(false);
          return;
        }

        const values = form.getValues();
        try {
          await processWithdrawal.mutateAsync(values, {
            onSuccess: () => {
              queryClient.invalidateQueries({ 
                queryKey: ["processInvestments"] 
              });
              router.push("/dashboard/withdraw/success");
            }
          });
        } finally {
          setIsConfirmed(false);
        }
      };

      executeSubmission();
    }
  }, [isConfirmed]);


  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
     <div className="max-w-[32rem] w-full px-6 py-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Withdrawal Form
        </h2>
        
        <Form {...form}>
          <form 
            onSubmit={form.handleSubmit(handleDialogOpen)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="withdrawalAmount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Withdrawal Amount
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Withdrawal amount"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-2 text-sm text-gray-500">
                    Minimum withdrawal amount must worth 100 US Dollars
                  </FormDescription>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="block text-sm font-medium text-gray-700">
                    Wallet Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Wallet Address"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription className="mt-2 text-sm text-gray-500">
                    Enter your wallet address
                  </FormDescription>
                  <FormMessage className="text-sm text-red-500" />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="cryptoType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cryptocurrency Type</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Cryptocurrency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Cryptocurrencies</SelectLabel>
                        {cryptocurrencies.map((crypto) => (
                          <SelectItem key={crypto.name} value={crypto.name}>
                            {`${crypto.name} - ${crypto.fullname}`}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Choose the crypto type to withdraw to
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              {processWithdrawal.error && (
                <p className="text-sm text-red-500">
                  {processWithdrawal.error.message}
                </p>
              )}
            </div>
            <div className="w-full text-center mb-4">
  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium 
    ${eligibilityData.isEligible 
      ? 'bg-green-100 text-green-800' 
      : 'bg-yellow-100 text-yellow-800'}`}>
    {eligibilityData.isEligible ? (
      eligibilityData.isManualOverride ? (
        <>✅ Authorized by Admin</>
      ) : (
        <>✅ Eligible ({eligibilityData.tradeCount} trades)</>
      )
    ) : (
      <>⚠️ Requires {remainingTrades} more trade{remainingTrades !== 1 ? 's' : ''}</>
    )}
  </span>
</div>


            <div className="flex justify-center">
            <DrawerDialogDemo
          component={ConfirmWithdrawal}
          setIsConfirmed={setIsConfirmed}
          isOpen={isDialogOpen}
          setIsOpen={setIsDialogOpen}
          eligibilityData={eligibilityData}
          formValues={form.getValues()} 
            >
<Button
  type="submit"
  disabled={processWithdrawal.isPending || (!eligibilityData.isEligible && !eligibilityData.isManualOverride)}
  className={`w-full max-w-[12rem] py-2 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
    ${eligibilityData.isEligible || eligibilityData.isManualOverride
      ? 'bg-yellow-400 hover:bg-yellow-600' 
      : 'bg-gray-400 cursor-not-allowed'}`}
>
  {eligibilityData.isEligible || eligibilityData.isManualOverride 
    ? 'Submit' 
    : `Need ${remainingTrades} Trades`}
</Button>



            </DrawerDialogDemo>
          </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
