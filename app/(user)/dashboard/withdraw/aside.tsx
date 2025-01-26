

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
  withdrawalAmount: z.coerce.number().gte(1),
  walletAddress: z.string().min(1).max(255),
  cryptoType: z.string().min(1).max(255),
});

const fetchUserTrades = async () => {
  const response = await fetch('/api/getTrades');
  if (!response.ok) throw new Error('Failed to fetch trades');
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

  React.useEffect(() => {
    if (isConfirmed) {
      form.handleSubmit(onSubmit)();
      setIsConfirmed(false);
    }
  }, [isConfirmed]);

  // const handleDialogOpen = async () => {
  //   const isValid = await form.trigger();
  //   if (isValid) {
  //     setIsDialogOpen(true);
  //   } else {
  //     setIsDialogOpen(false);
  //   }
  // };

  const handleDialogOpen = async () => {
    const isValid = await form.trigger();
    if (!isValid) {
      setIsDialogOpen(false);
      return;
    }
  
    try {
      const trades = await fetchUserTrades();
      const tradesCount = trades?.length || 0;
      const remainingTrades = Math.max(3 - tradesCount, 0);
  
      if (tradesCount < 3) {
        toast.error(`You must place ${remainingTrades} more trade${remainingTrades > 1 ? 's' : ''} before withdrawing.`);
        console.log(`User has ${tradesCount} trades. ${remainingTrades} more trade(s) needed to withdraw.`);
        setIsDialogOpen(false);
        return;
      }
  
      toast.success(`You are eligible to withdraw. You have placed ${tradesCount} trades.`);
      console.log(`User is eligible to withdraw with ${tradesCount} trades.`);
      setIsDialogOpen(true);
    } catch (error) {
      toast.error("An error occurred while fetching trades.");
      console.error(error);
      setIsDialogOpen(false);
    }
  };

  
  async function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      processWithdrawal.mutateAsync(values, {
        onSuccess(data, variables, context) {
          queryClient.invalidateQueries({
            queryKey: ["processInvestments"],
          });
          router.push("/dashboard/withdraw/success");
        },
      }),
      {
        loading: "Processing withdrawal...",
        success: "Withdrawal processed successfully!",
        error: (error) => error.error || "An error occurred!",
      }
    );
  }
  const { data: trades, isLoading } = useQuery({
    queryKey: ['trades'],
    queryFn: fetchUserTrades
  });

  const tradesCount = trades?.length || 0;
  const remainingTrades = Math.max(3 - tradesCount, 0);
  const canWithdraw = tradesCount >= 3;

  // Warning banner component
  const WithdrawalWarning = () => (
    <AnimatePresence>
      {!canWithdraw && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-amber-700">
                {remainingTrades > 0 
                  ? `You must place ${remainingTrades} more trade${remainingTrades > 1 ? 's' : ''} before withdrawing.`
                  : 'You can now withdraw your funds.'}
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
     <div className="max-w-[32rem] w-full px-6 py-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Withdrawal Form
        </h2>
        
        <Form {...form}>
          <form noValidate className="space-y-6">
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
            <div className="flex justify-center">
            <DrawerDialogDemo
              component={ConfirmWithdrawal}
              setIsConfirmed={setIsConfirmed}
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
            >
              <Button
                type="button"
                disabled={processWithdrawal.isPending || !canWithdraw}
                className={`w-full max-w-[12rem] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${canWithdraw 
                    ? 'bg-indigo-600 hover:bg-indigo-700' 
                    : 'bg-gray-400 cursor-not-allowed'} 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                onClick={async () => await handleDialogOpen()}
              >
                Submit
              </Button>
            </DrawerDialogDemo>
          </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
