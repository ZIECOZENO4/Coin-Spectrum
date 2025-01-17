// emails/TradeEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Tailwind,
  } from "@react-email/components";
  
  interface TradeEmailProps {
    userName: string;
    symbol: string;
    type: string;
    amount: string;
    leverage: string;
    expiry: string;
    tradeId: string;
  }
  
  export const TradeEmail = ({
    userName,
    symbol,
    type,
    amount,
    leverage,
    expiry,
    tradeId,
  }: TradeEmailProps) => (
    <Html>
      <Head />
      <Preview>Trade Confirmation - {symbol}</Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="bg-white p-8 rounded-lg shadow-lg">
            <Heading className="text-2xl mb-4">Trade Confirmation</Heading>
            
            <Section className="mb-6">
              <Text>Dear {userName},</Text>
              <Text>Your trade has been placed successfully. Here are the details:</Text>
            </Section>
  
            <Section className="bg-gray-100 p-4 rounded-lg mb-6">
              <Text className="font-bold">Trade Details:</Text>
              <Text>Symbol: {symbol}</Text>
              <Text>Type: {type}</Text>
              <Text>Amount: ${amount}</Text>
              <Text>Leverage: {leverage}x</Text>
              <Text>Expiry: {expiry}</Text>
              <Text>Trade ID: {tradeId}</Text>
            </Section>
  
            <Text className="text-sm text-gray-500">
              Please note that trading involves risk. Always use proper risk management.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  