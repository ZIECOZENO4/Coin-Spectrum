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
  
  interface ClaimInvestmentEmailProps {
    userFirstName: string;
    amount: string;
    planName: string;
    investmentId: string;
    dailyProfit: string;
    totalProfitPaid: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";
  
  export const ClaimInvestmentEmail = ({
    userFirstName,
    amount,
    planName,
    investmentId,
    dailyProfit,
    totalProfitPaid,
    isAdminCopy
  }: ClaimInvestmentEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Daily Profit Claimed - {investmentId}</Preview>
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
                Daily Profit Claimed
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `${userFirstName} has claimed their daily profit`
                    : `Dear ${userFirstName}, your daily profit has been successfully claimed.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Claim Details:</Text>
                  <Text>Investment Amount: ${amount}</Text>
                  <Text>Plan: {planName}</Text>
                  <Text>Daily Profit Claimed: ${dailyProfit}</Text>
                  <Text>Total Profit Paid: ${totalProfitPaid}</Text>
                  <Text>Reference ID: {investmentId}</Text>
                </div>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/investment/${investmentId}`}
                >
                  {isAdminCopy ? 'View Investment Details' : 'Track Your Investment'}
                </Button>
              </Section>
  
              {!isAdminCopy && (
                <Text className="text-sm text-gray-500 mt-8 text-center">
                  Thank you for investing with us. For any questions about your investment, please contact our support team.
                </Text>
              )}
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  