// components/emails/WithdrawalAcceptedEmail.tsx
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
  
  interface WithdrawalAcceptedEmailProps {
    userFirstName: string;
    amount: string;
    withdrawalId: string;
    transactionDate: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const WithdrawalAcceptedEmail = ({
    userFirstName,
    amount,
    withdrawalId,
    transactionDate,
    isAdminCopy
  }: WithdrawalAcceptedEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Withdrawal Request Accepted - {withdrawalId}</Preview>
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
                Withdrawal {isAdminCopy ? 'Processed' : 'Accepted'}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `Withdrawal processed for ${userFirstName}`
                    : `Dear ${userFirstName}, your withdrawal request has been accepted and processed.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Withdrawal Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Status: Completed</Text>
                  <Text>Processing Date: {transactionDate}</Text>
                  <Text>Reference ID: {withdrawalId}</Text>
                </div>
  
                {!isAdminCopy && (
                  <Text className="text-sm text-gray-500 mt-4">
                    The funds should be available in your account within 1-3 business days, depending on your bank's processing time.
                  </Text>
                )}
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/withdrawals/${withdrawalId}`}
                >
                  {isAdminCopy ? 'View Withdrawal Details' : 'Track Your Withdrawal'}
                </Button>
              </Section>
  
              {!isAdminCopy && (
                <Text className="text-sm text-gray-500 mt-6">
                  If you have any questions about this withdrawal, please contact our support team.
                </Text>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  