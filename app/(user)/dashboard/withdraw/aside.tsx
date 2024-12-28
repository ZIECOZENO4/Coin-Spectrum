// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useProcessWithdrawal } from "@/lib/tenstack-hooks/useProcessWithdrawal";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Link } from "lucide-react";
// import { cryptocurrencies } from "../deposit/plans/makePayment/cryptoCurrencies";

// export const formSchema = z.object({
//   withdrawalAmount: z.coerce.number().gte(100),
//   walletAddress: z.string().min(1).max(255),
//   cryptoType: z.string().min(1).max(255),
// });
// export function WithdrawalInput() {
//   // const { data: bankDetails } = useBankDetails();
//   const processWithdrawal = useProcessWithdrawal();

//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       withdrawalAmount: 0,
//       walletAddress: "",
//       cryptoType: "",
//     },
//   });

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     toast.promise(
//       processWithdrawal.mutateAsync(values, {
//         onSuccess(data, variables, context) {
//           queryClient.invalidateQueries({
//             queryKey: ["processInvestments"],
//           });
//           router.push("/dashboard/withdraw/success");
//         },
//       }),
//       {
//         loading: "Processing withdrawal...",
//         success: "Withdrawal processed successfully!",
//         error: (error) => error.error || "An error occurred!",
//       }
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen ">
//       <div className="max-w-[32rem] w-full px-6 py-8  rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Withdrawal Form
//         </h2>
//         <Form {...form}>
//           <form
//             noValidate
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-6 "
//           >
//             <FormField
//               control={form.control}
//               name="withdrawalAmount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="block text-sm font-medium text-gray-700">
//                     Withdrawal Amount
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Withdrawal amount"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="mt-2 text-sm text-gray-500">
//                     Minimum withdrawal amount is 100 Dollars
//                   </FormDescription>
//                   <FormMessage className="text-sm text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="walletAddress"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="block text-sm font-medium text-gray-700">
//                     Account Number
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
//                       placeholder="Wallet Address"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="mt-2 text-sm text-gray-500">
//                     Enter your account number
//                   </FormDescription>
//                   <FormMessage className="text-sm text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="cryptoType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Cryptocurrency" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Cryptocurrencies</SelectLabel>
//                         {cryptocurrencies.map((crypto) => (
//                           <SelectItem key={crypto.name} value={crypto.name}>
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>
//                     Choose the crypto type to withdraw to
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div>
//               {processWithdrawal.error && (
//                 <p className="text-sm text-red-500">
//                   {processWithdrawal.error.message}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-center">
//               <Button
//                 type="submit"
//                 className="w-full max-w-[12rem] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Submit
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { toast } from "sonner";
// import { useQueryClient } from "@tanstack/react-query";
// import { useRouter } from "next/navigation";
// import { useProcessWithdrawal } from "@/lib/tenstack-hooks/useProcessWithdrawal";
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cryptocurrencies } from "../deposit/plans/makePayment/cryptoCurrencies";
// import React from "react";
// import { ConfirmWithdrawal } from "./confirmWithdrawal";
// import { DrawerDialogDemo } from "./drawer-or-alert";

// export const formSchema = z.object({
//   withdrawalAmount: z.coerce.number().gte(100),
//   walletAddress: z.string().min(1).max(255),
//   cryptoType: z.string().min(1).max(255),
// });

// export function WithdrawalInput() {
//   const processWithdrawal = useProcessWithdrawal();
//   const queryClient = useQueryClient();
//   const router = useRouter();
//   const [isConfirmed, setIsConfirmed] = React.useState(false);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       withdrawalAmount: 0,
//       walletAddress: "",
//       cryptoType: "",
//     },
//   });

//   React.useEffect(() => {
//     if (isConfirmed) {
//       form.handleSubmit(onSubmit)();
//       setIsConfirmed(false);
//     }
//   }, [isConfirmed]);

//   async function onSubmit(values: z.infer<typeof formSchema>) {
//     toast.promise(
//       processWithdrawal.mutateAsync(values, {
//         onSuccess(data, variables, context) {
//           queryClient.invalidateQueries({
//             queryKey: ["processInvestments"],
//           });
//           router.push("/dashboard/withdraw/success");
//         },
//       }),
//       {
//         loading: "Processing withdrawal...",
//         success: "Withdrawal processed successfully!",
//         error: (error) => error.error || "An error occurred!",
//       }
//     );
//   }

//   return (
//     <div className="flex justify-center items-center min-h-screen">
//       <div className="max-w-[32rem] w-full px-6 py-8 rounded-lg shadow-md">
//         <h2 className="text-2xl font-semibold mb-6 text-center">
//           Withdrawal Form
//         </h2>
//         <Form {...form}>
//           <form noValidate className="space-y-6">
//             <FormField
//               control={form.control}
//               name="withdrawalAmount"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="block text-sm font-medium text-gray-700">
//                     Withdrawal Amount
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       placeholder="Withdrawal amount"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="mt-2 text-sm text-gray-500">
//                     Minimum withdrawal amount is 100 Dollars
//                   </FormDescription>
//                   <FormMessage className="text-sm text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="walletAddress"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="block text-sm font-medium text-gray-700">
//                     Wallet Address
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       type="text"
//                       placeholder="Wallet Address"
//                       className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormDescription className="mt-2 text-sm text-gray-500">
//                     Enter your wallet address
//                   </FormDescription>
//                   <FormMessage className="text-sm text-red-500" />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="cryptoType"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Cryptocurrency Type</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger className="w-full">
//                         <SelectValue placeholder="Select Cryptocurrency" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectGroup>
//                         <SelectLabel>Cryptocurrencies</SelectLabel>
//                         {cryptocurrencies.map((crypto) => (
//                           <SelectItem key={crypto.name} value={crypto.name}>
//                             {crypto.name}
//                           </SelectItem>
//                         ))}
//                       </SelectGroup>
//                     </SelectContent>
//                   </Select>
//                   <FormDescription>
//                     Choose the crypto type to withdraw to
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div>
//               {processWithdrawal.error && (
//                 <p className="text-sm text-red-500">
//                   {processWithdrawal.error.message}
//                 </p>
//               )}
//             </div>
//             <div className="flex justify-center">
//               <DrawerDialogDemo
//                 component={ConfirmWithdrawal}
//                 setIsConfirmed={setIsConfirmed}
//               >
//                 <Button
//                   type="button"
//                   className="w-full max-w-[12rem] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//                 >
//                   Submit
//                 </Button>
//               </DrawerDialogDemo>
//             </div>
//           </form>
//         </Form>
//       </div>
//     </div>
//   );
// }

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
import { useQueryClient } from "@tanstack/react-query";
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

export const formSchema = z.object({
  withdrawalAmount: z.coerce.number().gte(100),
  walletAddress: z.string().min(1).max(255),
  cryptoType: z.string().min(1).max(255),
});

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

  const handleDialogOpen = async () => {
    const isValid = await form.trigger();
    if (isValid) {
      setIsDialogOpen(true);
    } else {
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

  return (
    <div className="flex justify-center items-center min-h-screen">
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
                    Minimum withdrawal amount is 100 Dollars
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
                  disabled={processWithdrawal.isPending}
                  className="w-full max-w-[12rem] py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
