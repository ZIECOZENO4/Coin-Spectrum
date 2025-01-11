// emails/NotificationEmail.tsx
import {
    Body,
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
  
  interface NotificationEmailProps {
    userFirstName: string;
    userEmail: string;
    message: string;
    timestamp?: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";
  
  export const NotificationEmail = ({
    userFirstName,
    userEmail,
    message,
    timestamp = new Date().toLocaleString(),
  }: NotificationEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Email Confirmation - Coin Spectrum</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg max-w-[600px] mx-auto">
              <Img
                src={`${baseUrl}/images/cs.png`}
                width="120"
                height="50"
                alt="Coin Spectrum Logo"
                className="mx-auto mb-6"
              />
              
              <Heading className="text-center text-2xl text-gray-800 mb-6">
                Message Sent Successfully
              </Heading>
  
              <Section className="border-b border-gray-200 pb-6 mb-6">
                <Text className="text-gray-700 mb-4">
                  Dear {userFirstName},
                </Text>
                <Text className="text-gray-700">
                  Your message has been successfully sent to the Coin Spectrum team. We'll get back to you as soon as possible.
                </Text>
              </Section>
  
              <Section className="bg-gray-50 p-4 rounded-lg mb-6">
                <Text className="font-semibold text-gray-700 mb-2">Message Details:</Text>
                <Text className="text-gray-600 mb-2">From: {userEmail}</Text>
                <Text className="text-gray-600 mb-2">Sent at: {timestamp}</Text>
                <Text className="text-gray-600 italic">"{message}"</Text>
              </Section>
  
              <Text className="text-sm text-gray-500 text-center">
                If you didn't send this message, please contact our support team immediately.
              </Text>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  