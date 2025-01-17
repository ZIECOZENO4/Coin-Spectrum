// emails/SignalEmail.tsx
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
  
  interface SignalEmailProps {
    userName: string;
    signalName: string;
    price: number;
    percentage: number;
    expiry: string;
    risk: string;
    description: string;
  }
  
  export const SignalEmail = ({
    userName,
    signalName,
    price,
    percentage,
    expiry,
    risk,
    description,
  }: SignalEmailProps) => (
    <Html>
      <Head />
      <Preview>Your Trading Signal Purchase: {signalName}</Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="bg-white p-8 rounded-lg shadow-lg">
            <Heading className="text-2xl mb-4">Trading Signal Details</Heading>
            
            <Section className="mb-6">
              <Text>Dear {userName},</Text>
              <Text>Thank you for purchasing the trading signal. Here are your signal details:</Text>
            </Section>
  
            <Section className="bg-gray-100 p-4 rounded-lg mb-6">
              <Text className="font-bold">Signal Information:</Text>
              <Text>Name: {signalName}</Text>
              <Text>Price: ${price}</Text>
              <Text>Expected Return: {percentage}%</Text>
              <Text>Expiry: {expiry}</Text>
              <Text>Risk Level: {risk}</Text>
              <Text className="mt-4">Analysis: {description}</Text>
            </Section>
  
            <Text className="text-sm text-gray-500">
              Please note that trading involves risk. Always use proper risk management.
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
  