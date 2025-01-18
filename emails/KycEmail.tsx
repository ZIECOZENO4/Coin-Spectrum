// emails/KycEmail.tsx
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
  
  interface KycEmailProps {
    userFirstName: string;
    status: "approved" | "rejected";
    rejectionReason?: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";
  
  export const KycEmail = ({
    userFirstName,
    status,
    rejectionReason,
    isAdminCopy,
  }: KycEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>KYC Verification {status.toUpperCase()}</Preview>
        <Tailwind>
          <Body className="bg-gray-50">
            <Container className="bg-white p-8 rounded-lg shadow-lg">
              <Img
                src={`${baseUrl}/logo.png`}
                width="184"
                height="75"
                alt="Logo"
                className="mx-auto my-8"
              />
              
              <Heading className="text-center text-2xl mb-4">
                KYC Verification {status.toUpperCase()}
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `${userFirstName}'s KYC verification has been ${status}`
                    : `Dear ${userFirstName}, your KYC verification has been ${status}`
                  }
                </Text>
  
                {status === "rejected" && rejectionReason && (
                  <div className="bg-red-50 p-4 rounded-lg mb-4">
                    <Text className="text-red-600">Reason for rejection: {rejectionReason}</Text>
                  </div>
                )}
  
                {status === "approved" && (
                  <Text className="text-green-600">
                    You can now access all platform features that require verification.
                  </Text>
                )}
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/dashboard/kyc`}
                >
                  View KYC Details
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  