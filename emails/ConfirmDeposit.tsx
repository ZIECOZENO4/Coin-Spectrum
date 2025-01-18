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
  
  interface DepositEmailProps {
    userFirstName: string;
    amount: string;
    type: string;
    status: "pending" | "approved" | "rejected";
    transactionDate: string;
    depositId: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";
  
  export const DepositEmail = ({
    userFirstName,
    amount,
    type,
    status,
    transactionDate,
    depositId,
    isAdminCopy,
  }: DepositEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Deposit {status.toUpperCase()} - {depositId}</Preview>
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
                Deposit {status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `${userFirstName} has submitted a deposit request`
                    : `Dear ${userFirstName}, your deposit has been ${status}`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Deposit Details:</Text>
                  <Text>Amount: {amount} {type}</Text>
                  <Text>Status: {status.toUpperCase()}</Text>
                  <Text>Date: {new Date(transactionDate).toLocaleDateString()}</Text>
                  <Text>Reference ID: {depositId}</Text>
                </div>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/dashboard/deposits/${depositId}`}
                >
                  View Deposit Details
                </Button>
              </Section>
  
              {!isAdminCopy && status === "approved" && (
                <Text className="text-sm text-gray-500 mt-8 text-center">
                  Your deposit has been credited to your account. You can now start investing or trading.
                </Text>
              )}
  
              {!isAdminCopy && status === "pending" && (
                <Text className="text-sm text-gray-500 mt-8 text-center">
                  Your deposit is being processed. We will notify you once it's confirmed.
                </Text>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  