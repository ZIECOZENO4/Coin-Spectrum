import { TransferEmailProps } from "./transfer-email";
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

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ? `${process.env.NEXT_PUBLIC_APP_URL}`
  : "https://www.coinspectrum.net/"; 
  
export const TransferReceived = ({
  recipientName,
  senderName,
  amount,
  transferId,
  transferDate
}: TransferEmailProps) => (
  <Html>
    <Head />
    <Preview>You received ${amount.toFixed(2)} from {senderName}</Preview>
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
            Transfer Received
            </Heading>

            <Section>
              <Text>
                Dear {recipientName},
              </Text>
              <Text>
              You have received $${amount.toFixed(2)} from ${senderName}.
              </Text>
            </Section>

          <Section>
            <Text>Dear {recipientName},</Text>
            <Text className="mt-4">
              You've received <strong>${amount.toFixed(2)}</strong> from {senderName}.
            </Text>
          </Section>

          <Section className="my-6 bg-green-50 p-4 rounded">
            <Text className="font-bold text-green-700">Credit Notification:</Text>
            <Text>Amount: ${amount.toFixed(2)}</Text>
            <Text>From: {senderName}</Text>
            <Text>Transaction ID: {transferId}</Text>
            <Text>Received: {transferDate}</Text>
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
