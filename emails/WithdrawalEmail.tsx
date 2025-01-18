// emails/WithdrawalEmail.tsx
import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text,
    Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  interface WithdrawalEmailProps {
    userFirstName: string;
    amount: string;
    cryptoType: string;
    walletAddress: string;
    status: "approved" | "rejected";
    rejectionReason?: string;
    withdrawalId: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";
  
  export const WithdrawalEmail = ({
    userFirstName,
    amount,
    cryptoType,
    walletAddress,
    status,
    rejectionReason,
    withdrawalId,
    isAdminCopy,
  }: WithdrawalEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Withdrawal {status === "approved" ? "Approved" : "Rejected"} - {withdrawalId}</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg">
              <Img
                src={`${baseUrl}/logo.png`}
                width="184"
                height="75"
                alt="Logo"
                className="mx-auto my-8"
              />
              
              <Heading className="text-center text-2xl mb-4">
                Withdrawal {status === "approved" ? "Approved" : "Rejected"}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `${userFirstName}'s withdrawal has been ${status}`
                    : `Dear ${userFirstName}, your withdrawal request has been ${status}.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Withdrawal Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Crypto Type: {cryptoType}</Text>
                  <Text>Wallet Address: {walletAddress}</Text>
                  <Text>Status: {status.toUpperCase()}</Text>
                  {rejectionReason && (
                    <Text className="text-red-500">Reason: {rejectionReason}</Text>
                  )}
                  <Text>Reference ID: {withdrawalId}</Text>
                </div>
              </Section>
  
              {!isAdminCopy && (
                <Text className="text-sm text-gray-500 mt-8 text-center">
                  {status === "approved" 
                    ? "Your withdrawal has been processed. Please check your wallet."
                    : "If you have any questions, please contact our support team."}
                </Text>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  