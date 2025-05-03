"use client";
import React, { useState, useTransition } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signUp } from "../../_action/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { countries } from "@/lib/countries"; // You'll need to create this

export default function SignupFormDemo() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    country: '',
    currency: 'USD',
    tradingAccountType: 'MT5',
    cryptoAccounts: {} as Record<string, string>,
  });

  const cryptoOptions = [
    { value: 'bitcoin', label: 'Bitcoin' },
    { value: 'usdt_trc20', label: 'USDT TRC20' },
    { value: 'ethereum', label: 'Ethereum' },
    { value: 'litecoin', label: 'Litecoin' },
    { value: 'dogecoin', label: 'Dogecoin' },
    { value: 'xrp', label: 'XRP' },
    { value: 'usdt_erc20', label: 'USDT ERC20' },
  ];

  const currencyOptions = [
    { value: 'KWD', label: 'Kuwaiti Dinar (Strongest)' },
    { value: 'BHD', label: 'Bahraini Dinar' },
    { value: 'OMR', label: 'Omani Rial' },
    { value: 'JOD', label: 'Jordanian Dinar' },
    { value: 'GBP', label: 'British Pound' },
    { value: 'GIP', label: 'Gibraltar Pound' },
    { value: 'KYD', label: 'Cayman Islands Dollar' },
    { value: 'CHF', label: 'Swiss Franc' },
    { value: 'EUR', label: 'Euro' },
    { value: 'USD', label: 'US Dollar (Most Traded)' },
    { value: 'CAD', label: 'Canadian Dollar' },
    { value: 'AUD', label: 'Australian Dollar' },
    { value: 'NZD', label: 'New Zealand Dollar' },
    { value: 'SGD', label: 'Singapore Dollar' },
    { value: 'BND', label: 'Brunei Dollar' },
    { value: 'JPY', label: 'Japanese Yen' },
    { value: 'CNY', label: 'Chinese Yuan' },
    { value: 'HKD', label: 'Hong Kong Dollar' },
    { value: 'SEK', label: 'Swedish Krona' },
    { value: 'NOK', label: 'Norwegian Krone' }
  ];
  

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    (Object.entries(formData) as Array<[keyof typeof formData, string | Record<string, string>]>).forEach(([key, value]) => {
      if (key === 'cryptoAccounts') {
        formDataToSend.append(key, JSON.stringify(value));
      } else {
        formDataToSend.append(key, value as string);
      }
    });
    
    startTransition(async () => {
      const result = await signUp(formDataToSend);

      if (result.success) {
        toast.success('Account created successfully!');
        router.push('/dashboard');
      } else {
        toast.error(result.error || 'Failed to create account. Please try again.');
      }
    });
  };

  const filteredCountries = countries
  .filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => a.name.localeCompare(b.name));

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'cryptoType') {
      setSelectedCrypto(value);
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  
  const handleCryptoAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setFormData(prev => ({
      ...prev,
      cryptoAccounts: {
        ...prev.cryptoAccounts,
        [selectedCrypto]: value
      }
    }));
  };

  return (
    <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input bg-white dark:bg-black">
      <div className="flex justify-center mb-4">
        <Image src="/cs.png" alt="Logo" width={100} height={100} />
      </div>
      <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200 text-center">
        Register
      </h2>
      <p className="text-neutral-600 text-sm max-w-sm mt-2 dark:text-neutral-300 text-center">
        Signup now and get started with COIN SPECTRUM.
      </p>

      <form className="my-8" onSubmit={handleSubmit}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
          <LabelInputContainer>
            <Label htmlFor="firstName">First name</Label>
            <Input
              id="firstName"
              name="firstName"
              placeholder="John"
              type="text"
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
          <LabelInputContainer>
            <Label htmlFor="lastName">Last name</Label>
            <Input
              id="lastName"
              name="lastName"
              placeholder="Doe"
              type="text"
              onChange={handleInputChange}
              required
            />
          </LabelInputContainer>
        </div>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            placeholder="johndoe"
            type="text"
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            name="email"
            placeholder="john@example.com"
            type="email"
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="+1234567890"
            type="tel"
            onChange={handleInputChange}
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
        <Label htmlFor="currency">Currency</Label>
        <select
          id="currency"
          name="currency"
          value={formData.currency}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {currencyOptions.map((currency) => (
            <option key={currency.value} value={currency.value}>
              {currency.label}
            </option>
          ))}
        </select>
      </LabelInputContainer>

      <LabelInputContainer className="mb-4">
        <Label htmlFor="tradingAccountType">Trading Account Type</Label>
        <select
          id="tradingAccountType"
          name="tradingAccountType"
          value={formData.tradingAccountType}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="MT4">MetaTrader 4</option>
          <option value="MT5">MetaTrader 5</option>
        </select>
      </LabelInputContainer>

      <LabelInputContainer className="mb-4">
        <Label htmlFor="cryptoType">Crypto Account Type</Label>
        <select
          id="cryptoType"
          name="cryptoType"
          value={selectedCrypto}
          onChange={handleInputChange}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">Select Crypto Type</option>
          {cryptoOptions.map((crypto) => (
            <option key={crypto.value} value={crypto.value}>
              {crypto.label}
            </option>
          ))}
        </select>
      </LabelInputContainer>

      {selectedCrypto && (
        <LabelInputContainer className="mb-4">
          <Label htmlFor="cryptoWalletAddress">{cryptoOptions.find(c => c.value === selectedCrypto)?.label} Wallet Address</Label>
          <Input
            id="cryptoWalletAddress"
            name="cryptoWalletAddress"
            placeholder={`Enter ${cryptoOptions.find(c => c.value === selectedCrypto)?.label} Wallet Address`}
            type="text"
            value={formData.cryptoAccounts[selectedCrypto] || ''}
            onChange={handleCryptoAccountChange}
          />
        </LabelInputContainer>
      )}

<LabelInputContainer className="mb-4">
    <Label htmlFor="country">Country</Label>
    
    {/* Search Input */}
    <input
      type="text"
      placeholder="Search countries..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="w-full mb-2 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    />

    {/* Country Select */}
    <select
      id="country"
      name="country"
      value={formData.country}
      onChange={handleInputChange}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
    >
      <option value="">Select Country</option>
      {filteredCountries.map((country) => (
        <option key={country.code} value={country.code}>
          {country.name}
        </option>
      ))}
    </select>
  </LabelInputContainer>
  <LabelInputContainer className="mb-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Password@2025"
            type="password"
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>
        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Password@2025"
            type="password"
            onChange={handleInputChange}
            required
          />
        </LabelInputContainer>
        <button
          className="bg-gradient-to-br relative group/btn from-black dark:from-zinc-900 dark:to-zinc-900 to-neutral-600 block dark:bg-zinc-800 w-full text-white rounded-md h-10 font-medium shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:shadow-[0px_1px_0px_0px_var(--zinc-800)_inset,0px_-1px_0px_0px_var(--zinc-800)_inset]"
          type="submit"
          disabled={isPending}
        >
          {isPending ? 'Creating account...' : `Sign up and Get Started`}
          
          <BottomGradient />
        </button>
      </form>

      <div className="bg-gradient-to-r from-transparent via-neutral-300 dark:via-neutral-700 to-transparent my-8 h-[1px] w-full" />

    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
    </>
  );
};

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
