// components/emails/DepositRejectedEmail.tsx
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

interface DepositRejectedEmailProps {
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
  : "https://www.coinspectrum.net/";

export const DepositRejectedEmail = ({
  userFirstName,
  amount,
  type,
  status,
  transactionDate,
  depositId,
  isAdminCopy
}: DepositRejectedEmailProps) => {
  return (
      <Html>
          <Head />
          <Preview>Deposit Rejection Notice - {depositId}</Preview>
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
                          Deposit Rejection {isAdminCopy ? 'Notice' : 'Notification'}
                      </Heading>

                      <Section className="mb-6">
                          <Text className="mb-4">
                              {isAdminCopy 
                                  ? `Deposit rejected for ${userFirstName}`
                                  : `Dear ${userFirstName}, your deposit has been rejected.`
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

                      {!isAdminCopy && (
                          <Text className="text-sm text-gray-500 mt-6">
                              If you have any questions about this rejection, please contact our support team.
                          </Text>
                      )}
                  </Container>
              </Body>
          </Tailwind>
      </Html>
  );
};
