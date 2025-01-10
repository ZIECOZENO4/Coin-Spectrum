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
  
  interface InvestmentEmailProps {
    userFirstName: string;
    amount: string;
    planName: string;
    status: 'active' | 'completed' | 'cancelled';
    startDate: string;
    endDate: string;
    investmentId: string;
    roiPercentage?: string;
    totalProfitPercentage?: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const InvestmentEmail = ({
    userFirstName,
    amount,
    planName,
    status,
    startDate,
    endDate,
    investmentId,
    roiPercentage,
    totalProfitPercentage,
    isAdminCopy
  }: InvestmentEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Investment {status.toUpperCase()} - {investmentId}</Preview>
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
                Investment {status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `New investment created by ${userFirstName}`
                    : `Dear ${userFirstName}, your investment has been successfully created.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Investment Details:</Text>
                  <Text>Amount: ${amount}</Text>
                  <Text>Plan: {planName}</Text>
                  <Text>Status: {status}</Text>
                  <Text>Start Date: {startDate}</Text>
                  <Text>End Date: {endDate}</Text>
                  {roiPercentage && (
                    <Text>ROI: {roiPercentage}%</Text>
                  )}
                  {totalProfitPercentage && (
                    <Text>Total Profit: {totalProfitPercentage}%</Text>
                  )}
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
  