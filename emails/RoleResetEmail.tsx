// components/emails/RoleResetEmail.tsx
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
  
  interface RoleResetEmailProps {
    userFirstName: string;
    isAdminCopy?: boolean;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const RoleResetEmail = ({
    userFirstName,
    isAdminCopy
  }: RoleResetEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Account Role Update Notification</Preview>
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
                Account Role Update
              </Heading>
  
              <Section className="mb-6">
                <Text className="mb-4">
                  {isAdminCopy 
                    ? `User role has been reset to 'user' for ${userFirstName}`
                    : `Dear ${userFirstName}, your account role has been updated to 'user'.`
                  }
                </Text>
  
                <div className="bg-gray-100 p-4 rounded-lg">
                  <Text className="font-bold">Update Details:</Text>
                  <Text>New Role: User</Text>
                  <Text>Update Date: {new Date().toLocaleString()}</Text>
                </div>
  
                {!isAdminCopy && (
                  <Text className="mt-4">
                    If you believe this change was made in error, please contact our support team immediately.
                  </Text>
                )}
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={baseUrl}
                >
                  Visit Dashboard
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  