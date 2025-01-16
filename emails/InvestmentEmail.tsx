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

interface InvestmentEmailProps {
  userFirstName: string;
  amount: string;
  planName: string;
  transactionId: string;
  isAdminCopy?: boolean;
}

export const InvestmentEmail = ({
  userFirstName,
  amount,
  planName,
  transactionId,
  isAdminCopy,
}: InvestmentEmailProps) => (
  <Html>
    <Head />
    <Preview>Investment {isAdminCopy ? 'Created' : 'Confirmation'}</Preview>
    <Tailwind>
      <Body className="bg-gray-50">
        <Container className="bg-white p-8 rounded-lg shadow-lg">
          <Heading className="text-center text-2xl mb-4">
            Investment {isAdminCopy ? 'Created' : 'Confirmation'}
          </Heading>
          <Section className="mb-6">
            <Text>
              {isAdminCopy 
                ? `New investment created by ${userFirstName}`
                : `Dear ${userFirstName}, your investment has been created successfully.`
              }
            </Text>
            <div className="bg-gray-100 p-4 rounded-lg">
              <Text className="font-bold">Investment Details:</Text>
              <Text>Amount: ${amount}</Text>
              <Text>Plan: {planName}</Text>
              <Text>Transaction ID: {transactionId}</Text>
            </div>
          </Section>
        </Container>
      </Body>
    </Tailwind>
  </Html>
);
