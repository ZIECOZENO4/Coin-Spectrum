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
  
  interface SignInEmailProps {
    userFirstName: string;
    userEmail: string;
    signInTime: string;
    deviceInfo: string;
    location: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.omnicom.com.im/";
  
  export const SignInEmail = ({
    userFirstName,
    userEmail,
    signInTime,
    deviceInfo,
    location,
  }: SignInEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>New sign-in to your COIN SPECTRUM account</Preview>
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
  
              <Section className="mb-6">
                <Text className="text-gray-700">
                  Hello {userFirstName},
                </Text>
                
                <Text className="text-gray-700">
                  We detected a new sign-in to your COIN SPECTRUM account.
                </Text>
              </Section>
  
              <Section className="bg-gray-50 p-6 rounded-lg mb-6">
                <Text className="font-bold mb-4">Sign-in details:</Text>
                <Text className="mb-2">📧 Account: {userEmail}</Text>
                <Text className="mb-2">🕒 Time: {signInTime}</Text>
                <Text className="mb-2">💻 Device: {deviceInfo}</Text>
                <Text className="mb-2">📍 Location: {location}</Text>
              </Section>
  
              <Section className="mb-6">
                <Text className="text-gray-700">
                  If this wasn't you, please secure your account immediately.
                </Text>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-red-600 text-white rounded-lg py-3 px-6 mr-4"
                  href={`${baseUrl}/account`}
                >
                  Secure Account
                </Button>
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/user-profile`}
                >
                  Review Activity
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  