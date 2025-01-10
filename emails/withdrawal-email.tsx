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
    type: 'wallet' | 'bank';
    status: string;
    transactionDate: string;
    withdrawalId: string;
    paymentMethod: {
      type: string;
      accountHolderName?: string;
      bankName?: string;
      accountNumber?: string;
      walletProvider?: string;
      walletAddress?: string;
    };
    isAdminCopy?: boolean;
    rejectionReason?: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const WithdrawalEmail = ({
    userFirstName,
    amount,
    type,
    status,
    transactionDate,
    withdrawalId,
    paymentMethod,
    isAdminCopy,
    rejectionReason,
  }: WithdrawalEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Withdrawal Request {status === 'pending' ? 'Confirmation' : status.toUpperCase()} - {withdrawalId}</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg">
              <Img
                src={`${baseUrl}/images/COIN SPECTRUM.png`}
                width="184"
                height="75"
                alt="Logo"
                className="mx-auto my-8"
              />
              
              <Heading className="text-center text-2xl mb-4">
                Withdrawal Request {status === 'pending' ? 'Confirmation' : status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `New withdrawal request from ${userFirstName}`
                    : `Dear ${userFirstName}, your withdrawal request has been ${status}.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Withdrawal Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Type: {type}</Text>
                  <Text>Status: {status}</Text>
                  <Text>Date: {transactionDate}</Text>
                  <Text>Reference ID: {withdrawalId}</Text>
  
                  {type === 'bank' && (
                    <>
                      <Text>Bank Name: {paymentMethod.bankName}</Text>
                      <Text>Account Holder: {paymentMethod.accountHolderName}</Text>
                      <Text>Account Number: {paymentMethod.accountNumber}</Text>
                    </>
                  )}
  
                  {type === 'wallet' && (
                    <>
                      <Text>Wallet Provider: {paymentMethod.walletProvider}</Text>
                      <Text>Wallet Address: {paymentMethod.walletAddress}</Text>
                    </>
                  )}
  
                  {rejectionReason && (
                    <Text className="mt-4 text-red-600">
                      Reason for rejection: {rejectionReason}
                    </Text>
                  )}
                </div>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/withdrawal/${withdrawalId}`}
                >
                  {isAdminCopy ? 'View Withdrawal Details' : 'Track Your Withdrawal'}
                </Button>
              </Section>
  
              {!isAdminCopy && (
                <Text className="text-sm text-gray-500 mt-8 text-center">
                  If you did not initiate this withdrawal, please contact our support immediately.
                </Text>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  