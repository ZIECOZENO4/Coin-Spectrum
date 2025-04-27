"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaStar, FaCrown, FaCopy, FaCheck } from "react-icons/fa";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { InvestmentPlan } from "@prisma/client";
import { formatCurrency } from "@/lib/formatCurrency";
import { useDropzone } from "react-dropzone";
import { LoadingButton } from "@/components/ui/loading-button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import * as React from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Input } from "@/components/ui/input";
import { useFetchOneInvestmentPlan } from "@/lib/tenstack-hooks/usefetchAnInvestmentPlan";
import { useCreateInvestment } from "@/lib/tenstack-hooks/addAnewInvestment";
import { Wallets } from "@prisma/client";
import { cryptocurrencies } from "./cryptoCurrencies";

interface InvestmentPlanCardProps {
  id: string;
}

interface ImageData {
  url: string;
  id: string;
}

const InvestmentPlanCard: React.FC<InvestmentPlanCardProps> = ({ id }) => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState("none");
  const [transactionId, setTransactionId] = useState("");
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [amount, setAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const router = useRouter();
  const createInvestmentMutation = useCreateInvestment();

  // const investmentPlan = getInvestmentPlanByName(name);
  const { data: investmentPlan } = useFetchOneInvestmentPlan(id);
  if (!investmentPlan) {
    throw new Error("investment plan does not exist");
  }

  const renderStars = () => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(<FaStar key={i} className="text-xs text-yellow-500" />);
    }
    return stars;
  };  

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      setIsButtonDisabled(true);
      startUpload([file]);
    },
    accept: {
      "image/*": [
        ".png",
        ".jpg",
        ".jpeg",
        ".bmp",
        ".gif",
        ".tif",
        ".tiff",
        ".webp",
      ],
    },
    multiple: false,
  });

  const { startUpload, isUploading } = useUploadThing("uploadChatImage", {
    onUploadBegin(fileName) {
      setIsButtonDisabled(false);
    },
    async onClientUploadComplete(res) {
      if (res) {
        setImageData({ url: res[0].url, id: res[0].key });
        setIsButtonDisabled(false);
      }
    },
    onUploadError(res) {
      toast.error(`upload error code ${res.code}: ${res.cause} `, {
        duration: 10000,
      });
      setIsButtonDisabled(false);
    },
  });

  const handlePaidClick = async () => {
    if (!userEmail || !userName || !transactionId || !imageData?.url) {
      toast.error("Make sure that all of the fields are filled");
      return;
    }

    const investmentData = {
      investmentPlanId: investmentPlan.id,
      amount: amount,
      imageUrl: imageData.url,
      imageId: imageData.id,
      transactionId,
      userName,
      userEmail,
      crypto: selectedCrypto,
    };

    try {
      toast.promise(
        createInvestmentMutation.mutateAsync(
          {
            id: investmentPlan.id,
            amount: amount,
            imageUrl: imageData.url,
            imageId: imageData.id,
            transactionId,
            userName,
            userEmail,
            crypto: selectedCrypto as Wallets,
          },
          {
            onSuccess: (data) => {
             
              router.push("/await-confirmation");
            },
            onError: (error) => {
              console.error("Error creating investment:", error);
              // Perform any additional actions on error
            },
          }
        ),
        {
          loading: "Creating investment...",
          success: "Investment created successfully!",
          error: "Failed to create investment.",
        }
      );
    } catch (error) {
      console.error("Error creating investment:", error);
    }
  };
  const [value, copy] = useCopyToClipboard();

  useEffect(() => {
    if (value) {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  }, [value]);

  const handleCopyClick = () => {
    const address = cryptocurrencies.find(
      (crypto) => crypto.name === selectedCrypto
    )?.address;
    if (address) {
      copy(address);
    }
  };

  return (
    <Card className="w-full  flex flex-col justify-center max-w-2xl  items-center p-4 mx-auto border-2 container mb-5 border-orange-500 rounded-lg ">
      <CardContent className="flex flex-col justify-center  items-center">
        <div className="w-full mb-4">
          <div className="bg-gray-800 text-white p-4 rounded-lg mb-4 text-center">
            <p>Please choose the platform to use for payment</p>
          </div>
          <div className="flex px-4 justify-between items-center h-24 bg-orange-400 text-black mt-2">
            <p className="text-sm font-medium">Wallet Address:</p>
            <div className="flex flex-row items-center justify-center gap-1">
              <p className="text-[8px]">
              {selectedCrypto === "none" ? (
  <p className="text-sm">Choose the crypto type to transfer to</p>
) : (
  <p className="text-sm">
    {(() => {
      const address = cryptocurrencies.find(
        (crypto) => crypto.name === selectedCrypto
      )?.address;
      if (!address) return "Choose the crypto type to transfer to";
      
      const start = address.slice(0, 8);
      const end = address.slice(-8);
      return `${start}...${end}`;
    })()}
  </p>
)}


              </p>
              <Button onClick={handleCopyClick} className="ml-2">
                {copied ? <FaCheck className="text-green-500" /> : <FaCopy />}
              </Button>
            </div>
          </div>
          <Select onValueChange={(value) => setSelectedCrypto(value)}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Cryptocurrency" />
            </SelectTrigger>
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
        
        </div>

        <div className="bg-neutral-800 rounded-xl flex flex-col items-center justify-between w-full p-4 mb-4 text-white">
          <div className="flex flex-col items-center justify-between">
            <FaCrown className="w-12 h-12 mr-2" />
            <div className="flex">{renderStars()}</div>
          </div>

          <div>
            <p className="text-2xl font-bold">
            Min:  {formatCurrency(investmentPlan.minAmount)}
            </p>
          </div>
        </div>

        <div className="w-full mb-4">
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Plan:</p>
            <p className="text-sm">{investmentPlan.name}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Price Range:</p>
            <p className="text-sm">{investmentPlan.minAmount} - {investmentPlan.maxAmount}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">ROI Percent:</p>
            <p className="text-sm">
              {investmentPlan.roi}% after {investmentPlan.durationHours} hrs
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Principal Return:</p>
            <p className="text-sm">Yes</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Instant Withdraw:</p>
            <p className="text-sm">Yes available</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Credit Amount:</p>
            <p className="text-sm">${investmentPlan.minAmount.toLocaleString()}</p>
          </div>
          <div className="flex flex-col md:flex-row justify-between mb-2">
            <p className="text-sm font-medium">Deposit Fee:</p>
            <p className="text-sm">0.00% + $0.00 (min. $0.00 max. $0.00)</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center w-full mb-4">
          <h4 className="mb-2 text-sm font-bold">Upload Proof of Payment:</h4>
          {imageData?.url && (
            <Image
              src={imageData.url}
              alt="collection"
              className="object-cover rounded-lg mb-2"
              height={200}
              width={200}
            />
          )}
          <input {...getInputProps()} />
          <LoadingButton
            loading={isUploading}
            type="button"
            {...getRootProps()}
            className="bg-grey-1 bg-red-500"
            disabled={isButtonDisabled}
          >
            {isUploading ? (
              "Up"
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Upload Image
              </>
            )}
          </LoadingButton>
        </div>

        <div className="w-full mb-4">
          <Input
            type="text"
            placeholder="Transaction ID"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            className="w-full p-2 mb-2  rounded"
          />
           <Input
            type="number"
            min={investmentPlan.minAmount}
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mb-2  rounded"
          />
          <Input
            type="text"
            placeholder="Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            className="w-full p-2 mb-2  rounded"
          />
          <Input
            type="email"
            placeholder="Your Email"
            value={userEmail}
            onChange={(e) => setUserEmail(e.target.value)}
            className="w-full p-2 mb-2  rounded"
          />
        </div>

        <div className="flex flex-row items-center justify-center gap-4 w-full">
          <Button
            onClick={handlePaidClick}
    
            className="text-white bg-orange-500 rounded-lg w-full"
          >
            I HAVE PAID
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvestmentPlanCard;