// emails/TradeEmail.tsx
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
  
  interface TradeEmailProps {
    userName: string;
    symbol: string;
    type: string;
    amount: string;
    status: "approved" | "rejected" | "auto-approved";
    openPrice: string;
    leverage: string;
  }
  
  export const TradeEmail = ({
    userName,
    symbol,
    type,
    amount,
    status,
    openPrice,
    leverage,
  }: TradeEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Trade {status.toUpperCase()} - {symbol}</Preview>
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
                Trade {status === "auto-approved" ? "Automatically Approved" : status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Trade Details:</Text>
                  <Text>Trading Pair: {symbol}</Text>
                  <Text>Type: {type}</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Opening Price: ${openPrice}</Text>
                  <Text>Leverage: {leverage}x</Text>
                  <Text>Status: {status.toUpperCase()}</Text>
                </div>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  