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
export const TransferSent = ({
  recipientName,
  senderName,
  amount,
  transferId,
  transferDate
}: TransferEmailProps) => (
  <Html>
    <Head />
    <Preview>You sent ${amount.toFixed(2)} to {recipientName}</Preview>
    <Tailwind>
      <Body className="bg-gray-50">
        <Container className="bg-white p-2 rounded-lg shadow-lg">
          {/* Logo and header */}
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
            Transfer Sent
            </Heading>

            <Section>
              <Text>
                Dear {recipientName},
              </Text>
              <Text>
              You have successfully sent $${amount.toFixed(2)} to ${senderName}.
              </Text>
            </Section>

          <Section>
            <Text>Dear {senderName},</Text>
            <Text className="mt-4">
              Your transfer of <strong>${amount.toFixed(2)}</strong> to {recipientName} 
              was successfully processed.
            </Text>
          </Section>

          {/* Transaction details */}
          <Section className="my-6 bg-gray-50 p-4 rounded">
            <Text className="font-bold">Transaction Summary:</Text>
            <Text>Recipient: {recipientName}</Text>
            <Text>Amount Sent: ${amount.toFixed(2)}</Text>
            <Text>Transaction ID: {transferId}</Text>
            <Text>Processed: {transferDate}</Text>
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
