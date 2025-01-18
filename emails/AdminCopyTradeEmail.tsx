// emails/CopyTradeEmail.tsx
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
  
  interface CopyTradeEmailProps {
    userFirstName: string;
    traderName: string;
    amount: string;
    status: "approved" | "rejected" | "auto-approved";
    isAdminCopy?: boolean;
  }
  
  export const CopyTradeEmail = ({
    userFirstName,
    traderName,
    amount,
    status,
    isAdminCopy,
  }: CopyTradeEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Copy Trade {status.toUpperCase()}</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg">
              <Img
                src={`${process.env.NEXT_PUBLIC_APP_URL}/logo.png`}
                width="184"
                height="75"
                alt="Logo"
                className="mx-auto my-8"
              />
              
              <Heading className="text-center text-2xl mb-4">
                Copy Trade {status === "auto-approved" ? "Automatically Approved" : status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `${userFirstName}'s copy trade request for ${traderName} has been ${status}`
                    : `Dear ${userFirstName}, your copy trade request for ${traderName} has been ${status}`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Copy Trade Details:</Text>
                  <Text>Trader: {traderName}</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Status: {status.toUpperCase()}</Text>
                </div>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  