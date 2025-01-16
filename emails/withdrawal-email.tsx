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

interface WithdrawalEmailProps {
  userFirstName: string;
  amount: string;
  type: string;
  status: string;
  transactionDate: string;
  withdrawalId: string;
  walletAddress: string;
  cryptoType: string;
  isAdminCopy?: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.coinspectrum.net";

export const WithdrawalEmail = ({
  userFirstName,
  amount,
  type,
  status,
  transactionDate,
  withdrawalId,
  walletAddress,
  cryptoType,
  isAdminCopy,
}: WithdrawalEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>
        Withdrawal Request {status} - {withdrawalId}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="bg-white p-8 rounded-lg shadow-lg">
            <Img
              src={`${baseUrl}/images/logo.png`}
              width="184"
              height="75"
              alt="CoinSpectrum Logo"
              className="mx-auto my-8"
            />
            
            <Heading className="text-center text-2xl mb-4">
              Withdrawal Request {status}
            </Heading>

            <Section className="mb-6">
              <Text className="mb-4">
                {isAdminCopy 
                  ? `New withdrawal request from ${userFirstName}`
                  : `Dear ${userFirstName}, your withdrawal request has been received and is ${status}.`
                }
              </Text>

              <div className="bg-gray-100 p-4 rounded-lg">
                <Text className="font-bold">Withdrawal Details:</Text>
                <Text>Amount: ${amount}</Text>
                <Text>Cryptocurrency: {cryptoType}</Text>
                <Text>Status: {status}</Text>
                <Text>Date: {transactionDate}</Text>
                <Text>Transaction ID: {withdrawalId}</Text>
                <Text>Wallet Address: {walletAddress}</Text>
              </div>
            </Section>

            <Section className="text-center">
              <Button 
                className="bg-orange-500 text-white rounded-lg py-3 px-6"
                href={`${baseUrl}/dashboard/withdrawals/${withdrawalId}`}
              >
                {isAdminCopy ? 'Review Withdrawal' : 'Track Withdrawal'}
              </Button>
            </Section>

            {!isAdminCopy && (
              <Text className="text-sm text-gray-500 mt-6 text-center">
                If you did not request this withdrawal, please contact support immediately.
              </Text>
            )}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
