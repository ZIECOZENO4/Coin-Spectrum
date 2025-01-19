import {
    Body,
    Button,
    Column,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Link,
    Preview,
    Row,
    Section,
    Text,
    Tailwind,
  } from "@react-email/components";
  import * as React from "react";
  
  interface WelcomeEmailProps {
    userFirstName: string;
    userEmail: string;
  }
  
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";
  
  const steps = [
    {
      id: 1,
      Description: (
        <li className="mb-20" key={1}>
          <strong>Complete your profile.</strong>{" "}
          Add more information to help us serve you better.
        </li>
      ),
    },
    {
      id: 2,
      Description: (
        <li className="mb-20" key={2}>
          <strong>Verify your email.</strong>{" "}
          Check your inbox for the verification link.
        </li>
      ),
    },
    {
      id: 3,
      Description: (
        <li className="mb-20" key={3}>
          <strong>Sync your account.</strong>{" "}
          Get started quickly on COIN SPECTRUM, and speed up your financial state.
        </li>
      ),
    },
  ];
  
  export const WelcomeEmail = ({
    userFirstName,
    userEmail,
  }: WelcomeEmailProps) => {
    return (
      <Html>
        <Head />
        <Preview>Welcome to COIN SPECTRUM, {userFirstName}!</Preview>
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
                Welcome {userFirstName}!
              </Heading>
  
              <Section>
                <Text>
                  We're excited to have you join us! Your account has been created
                  with {userEmail}.
                </Text>
  
                <ul className="list-none">{steps.map(({ Description }) => Description)}</ul>
              </Section>
  
              <Section className="text-center">
                <Button 
                  className="bg-yellow-600 text-black rounded-lg py-3 px-6"
                  href={`${baseUrl}/sync`}
                  
                >
                  Sync your account
                </Button>
              </Section>
            </Container>
          </Body>
        </Tailwind>
      </Html>
    );
  };
  