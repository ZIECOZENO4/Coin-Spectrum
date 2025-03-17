// components/emails/WithdrawalApprovalEmail.tsx
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
  
  interface WithdrawalApprovalEmailProps {
    userName: string;
    tradeCount: number;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";
  
  export const WithdrawalApprovalEmail = ({
    userName,
    tradeCount
  }: WithdrawalApprovalEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>{userName}, you've met withdrawal requirements! 🎉</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg max-w-2xl">
              <Img
                src={`${baseUrl}/images/cs.png`}
                width="184"
                height="75"
                alt="Company Logo"
                className="mx-auto my-8"
              />
  
              <Heading className="text-center text-2xl mb-6">
                Congratulations {userName}! 🎉
              </Heading>
  
              <Section className="mb-8">
                <Img
                  src={`${baseUrl}/bitcoin.png`}
                  width="400"
                  height="300"
                  alt="Approval Illustration"
                  className="mx-auto mb-6"
                />
  
                <Text className="text-base mb-4">
                  Great news! You've successfully completed{' '}
                  <strong>{tradeCount} trades</strong> and met all requirements for withdrawals.
                </Text>
  
                <Text className="text-base mb-6">
                  You can now withdraw funds from your account at any time through our secure withdrawal portal:
                </Text>
  
                <div className="text-center">
                  <Button
                    href={`${baseUrl}/dashboard/withdraw`}
                    className="bg-yellow-600 text-black rounded-lg py-3 px-6 font-semibold hover:bg-yellow-700 transition-colors"
                  >
                    Make a Withdrawal
                  </Button>
                </div>
              </Section>
  
              <Section className="border-t border-gray-200 pt-6 mt-8">
                <Text className="text-sm text-gray-500 text-center mb-4">
                  Need help? Contact our support team at{' '}
                  <a href="mailto:support@yourdomain.com" className="text-yellow-600 underline">
                    support@coinspectrum.net
                  </a>
                </Text>
  
                <div className="flex justify-center space-x-4 mb-6">
                  <a href="https://twitter.com/yourplatform" className="text-yellow-600 hover:text-yellow-700">
                    Twitter
                  </a>
                  <a href="https://facebook.com/yourplatform" className="text-yellow-600 hover:text-yellow-700">
                    Facebook
                  </a>
                  <a href="https://linkedin.com/company/yourplatform" className="text-yellow-600 hover:text-yellow-700">
                    LinkedIn
                  </a>
                </div>
  
                <Text className="text-xs text-gray-400 text-center">
                  © 2025 Your Trading Platform. All rights reserved.<br />
                  14331 SW 120TH, ST MIAMI, FL 33186
                </Text>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  