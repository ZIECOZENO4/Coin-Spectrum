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

interface TransferEmailProps {
  recipientName: string;
  senderName: string;
  amount: number;
  transferType: 'sent' | 'received';
  transferId: string;
  transferDate: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}`
  : "https://www.coinspectrum.net/";

  export const TransferEmail: React.FC<TransferEmailProps> = ({
    recipientName,
    senderName,
    amount,
    transferType,
    transferId,
    transferDate
  }) => {
  return (
    <Html>
      <Head />
      <Preview>
        {transferType === 'sent' 
          ? `You sent $${amount.toFixed(2)} to ${recipientName}`
          : `You received $${amount.toFixed(2)} from ${senderName}`}
      </Preview>
      <Tailwind>
        <Body className="bg-gray-50">
          <Container className="bg-white p-2 rounded-lg shadow-lg">
            <Img
              src={`${baseUrl}/images/cs.png`}
              width="184"
              height="75"
              alt="Logo"
              className="mx-auto my-8"
            />
            
            <Heading className="text-center text-2xl mb-4">
              COIN SPECTRUM
            </Heading>
            
            <Heading className="text-center text-2xl mb-4">
              {transferType === 'sent' ? 'Transfer Sent' : 'Transfer Received'}
            </Heading>

            <Section>
              <Text>
                Dear {recipientName},
              </Text>
              <Text>
                {transferType === 'sent'
                  ? `You have successfully sent $${amount.toFixed(2)} to ${senderName}.`
                  : `You have received $${amount.toFixed(2)} from ${senderName}.`}
              </Text>
            </Section>

            <Section className="my-6">
              <Text><strong>Transfer Details:</strong></Text>
              <Text>Amount: ${amount.toFixed(2)}</Text>
              <Text>Transfer ID: {transferId}</Text>
              <Text>Date: {transferDate}</Text>
            </Section>

            <Section className="text-center mt-8 mb-10">
              <Button 
                className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                href={`${baseUrl}/dashboard`}
              >
                View Dashboard
              </Button>
            </Section>

            <Section className="border-t pt-6 mt-8">
              <Text className="text-sm text-gray-500 text-center">
                <strong>COIN SPECTRUM FINANCIAL SERVICES</strong><br />
                14331 SW 120TH, ST MIAMI, FL 33186<br />
                Phone: (+1) 409-359-8533 | Email: support@coinspectrum.net
              </Text>

              <Text className="text-xs text-gray-400 mt-4 text-center italic">
                {`This transaction has been electronically approved and recorded by 
                COIN SPECTRUM's secure payment system. Any unauthorized duplication 
                or disclosure is strictly prohibited.`}
              </Text>

              <Text className="text-xs text-gray-400 mt-4 text-center">
                Transaction ID: {transferId}<br />
                Processed at: {transferDate}<br />
                Approved by: COIN SPECTRUM AUTOMATED CLEARING SYSTEM
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};
