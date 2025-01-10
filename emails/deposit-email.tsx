// components/emails/deposit-email.tsx
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
    type: 'wallet' | 'bank';
    status: string;
    transactionDate: string;
    depositId: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const DepositEmail = ({
    userFirstName,
    amount,
    type,
    status,
    transactionDate,
    depositId,
    isAdminCopy
  }: DepositEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Deposit Submission Confirmation - {depositId}</Preview>
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
                Deposit Submission {isAdminCopy ? 'Notice' : 'Confirmation'}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `New deposit submission from ${userFirstName}`
                    : `Dear ${userFirstName}, your deposit has been submitted successfully.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Deposit Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Type: {type}</Text>
                  <Text>Status: {status}</Text>
                  <Text>Date: {transactionDate}</Text>
                  <Text>Reference ID: {depositId}</Text>
                </div>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/deposit/${depositId}`}
                >
                  {isAdminCopy ? 'View Deposit Details' : 'Track Your Deposit'}
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  