"use client";
import React, { useState, useTransition } from "react";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { signUp } from "../../_action/signup";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { countries } from "@/lib/countries";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertTriangle, Info, Eye, EyeOff } from "lucide-react";

export default function SignupFormDemo() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showProcessDetails, setShowProcessDetails] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

  // Validation functions
  const isFieldValid = (fieldName: string) => {
    switch (fieldName) {
      case 'firstName':
      case 'lastName':
        return typeof formData[fieldName as keyof typeof formData] === 'string' && (formData[fieldName as keyof typeof formData] as string).length >= 2;
      case 'username':
        return formData.username.length >= 3 && /^[a-zA-Z0-9_]+$/.test(formData.username);
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 'password':
        return formData.password.length >= 8 && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password);
      case 'confirmPassword':
        return formData.confirmPassword === formData.password && formData.confirmPassword.length > 0;
      case 'phoneNumber':
        return formData.phoneNumber.length >= 10;
      case 'country':
        return formData.country.length > 0;
      case 'cryptoWallet':
        return selectedCrypto ? (formData.cryptoAccounts[selectedCrypto]?.length || 0) >= 20 : true;
      default:
        return true;
    }
  };

  const processSteps = [
    {
      title: "Personal Information",
      fields: [
        { name: "firstName", label: "First Name", format: "Minimum 2 characters, letters only", example: "John" },
        { name: "lastName", label: "Last Name", format: "Minimum 2 characters, letters only", example: "Doe" },
        { name: "username", label: "Username", format: "3+ characters, alphanumeric and underscore only", example: "john_doe123" }
      ]
    },
    {
      title: "Contact Details",
      fields: [
        { name: "email", label: "Email Address", format: "Valid email format required", example: "john@example.com" },
        { name: "phoneNumber", label: "Phone Number", format: "Include country code, minimum 10 digits", example: "+1234567890" },
        { name: "country", label: "Country", format: "Select from dropdown list", example: "United States" }
      ]
    },
    {
      title: "Security",
      fields: [
        { name: "password", label: "Password", format: "8+ characters, uppercase, lowercase, number, special character", example: "MyPass@123" },
        { name: "confirmPassword", label: "Confirm Password", format: "Must match the password exactly", example: "MyPass@123" }
      ]
    },
    {
      title: "Trading Configuration",
      fields: [
        { name: "currency", label: "Preferred Currency", format: "Select your trading currency", example: "USD" },
        { name: "tradingAccountType", label: "Trading Platform", format: "Choose MetaTrader version", example: "MT5" }
      ]
    },
    {
      title: "Crypto Wallet (Optional)",
      fields: [
        { name: "cryptoType", label: "Crypto Type", format: "Select cryptocurrency type", example: "Bitcoin" },
        { name: "cryptoWallet", label: "Wallet Address", format: "Valid wallet address (20+ characters)", example: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" }
      ]
    }
  ];

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
          <Label htmlFor="country">Country</Label>
          <input
            type="text"
            placeholder="Search countries..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full mb-2 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
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
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              placeholder="Password@2025"
              type={showPassword ? "text" : "password"}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </LabelInputContainer>

        <LabelInputContainer className="mb-4">
          <Label htmlFor="confirmPassword">Confirm Password</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Password@2025"
              type={showConfirmPassword ? "text" : "password"}
              onChange={handleInputChange}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </LabelInputContainer>

        {/* Process Details Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 rounded-lg border border-blue-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <Info className="text-blue-600 dark:text-blue-400" size={20} />
              <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-300">
                Account Creation Process
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowProcessDetails(!showProcessDetails)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 transition-colors"
            >
              {showProcessDetails ? 'Hide Details' : 'Show Details'}
            </button>
          </div>

          {/* Warning Alert */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
          >
            <div className="flex items-start space-x-2">
              <AlertTriangle className="text-amber-600 dark:text-amber-400 mt-0.5" size={16} />
              <div>
                <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                  Important Warning
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                  Please follow the exact format specifications below. Failure to comply with these requirements will result in account creation failure.
                </p>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {showProcessDetails && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {processSteps.map((step, stepIndex) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: stepIndex * 0.1 }}
                    className="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700"
                  >
                    <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 flex items-center">
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full w-6 h-6 flex items-center justify-center text-sm mr-2">
                        {stepIndex + 1}
                      </span>
                      {step.title}
                    </h4>
                    <div className="space-y-3">
                      {step.fields.map((field, fieldIndex) => (
                        <motion.div
                          key={field.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: (stepIndex * 0.1) + (fieldIndex * 0.05) }}
                          className="flex items-start space-x-3 p-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                        >
                          <div className="mt-1">
                            {isFieldValid(field.name) ? (
                              <CheckCircle className="text-green-500" size={16} />
                            ) : (
                              <div className="w-4 h-4 border-2 border-gray-300 dark:border-gray-600 rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                              {field.label}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                              Format: {field.format}
                            </p>
                            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                              Example: {field.example}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                ))}

                {/* Additional Requirements */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-4 rounded-lg border border-purple-200 dark:border-purple-800"
                >
                  <h4 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">
                    Additional Requirements
                  </h4>
                  <ul className="text-sm text-purple-700 dark:text-purple-400 space-y-1">
                    <li>• All required fields must be completed</li>
                    <li>• Email address must be unique and verified</li>
                    <li>• Username must be unique across the platform</li>
                    <li>• Crypto wallet address is optional but recommended</li>
                    <li>• Phone number should include country code</li>
                  </ul>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

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
