// components/emails/WithdrawalRejectedEmail.tsx
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
  
  interface WithdrawalRejectedEmailProps {
    userFirstName: string;
    amount: string;
    reason: string;
    withdrawalId: string;
    transactionDate: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const WithdrawalRejectedEmail = ({
    userFirstName,
    amount,
    reason,
    withdrawalId,
    transactionDate,
    isAdminCopy
  }: WithdrawalRejectedEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Withdrawal Request Rejected - {withdrawalId}</Preview>
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
                Withdrawal Request {isAdminCopy ? 'Has Been' : ''} Rejected
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `Withdrawal rejected for ${userFirstName}`
                    : `Dear ${userFirstName}, your withdrawal request has been rejected.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Withdrawal Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Status: Rejected</Text>
                  <Text>Reason: {reason}</Text>
                  <Text>Date: {transactionDate}</Text>
                  <Text>Reference ID: {withdrawalId}</Text>
                </div>
              </Section>
  
              {!isAdminCopy && (
                <>
                  <Text className="text-sm text-gray-500 mt-4">
                    If you believe this was rejected in error or have questions, please contact our support team.
                  </Text>
                  <Section className="text-center mt-6">
                    <Button 
                      className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                      href={`${baseUrl}/support`}
                    >
                      Contact Support
                    </Button>
                  </Section>
                </>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  