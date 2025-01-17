import {
    Body,
    Button,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  interface CopyTradeEmailProps {
    userName: string;
    traderName: string;
    amount: string;
    percentageProfit: string;
    minCapital: string;
    transactionId: string;
    isAdminCopy?: boolean;
  }
  
  export const CopyTradeEmail = ({
    userName,
    traderName,
    amount,
    percentageProfit,
    minCapital,
    transactionId,
    isAdminCopy,
  }: CopyTradeEmailProps) => (
    <Html>
      <Head />
      <Preview>Copy Trade {isAdminCopy ? 'Notification' : 'Confirmation'}</Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="bg-white p-8 rounded-lg shadow-lg">
            <Heading className="text-center text-2xl mb-4">
              Copy Trade {isAdminCopy ? 'Notification' : 'Confirmation'}
            </Heading>
            
            <Section className="mb-6">
              <Text>
                {isAdminCopy 
                  ? `New copy trade created by ${userName}`
                  : `Dear ${userName}, your copy trade has been set up successfully.`
                }
              </Text>
              
              <div className="bg-gray-100 p-4 rounded-lg">
                <Text className="font-bold">Copy Trade Details:</Text>
                <Text>Trader: {traderName}</Text>
                <Text>Amount: ${amount}</Text>
                <Text>Expected Profit: {percentageProfit}%</Text>
                <Text>Minimum Capital: ${minCapital}</Text>
                <Text>Transaction ID: {transactionId}</Text>
              </div>
            </Section>
  
            {!isAdminCopy && (
              <Text className="text-sm text-gray-500 mt-6">
                Your account will now automatically mirror the trading activities of {traderName}.
                You can monitor your copy trade performance in your dashboard.
              </Text>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  