// components/emails/bank-details-email.tsx
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

interface BankDetailsEmailProps {
    userFirstName: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";

export const BankDetailsEmail = ({
    userFirstName,
    accountHolderName,
    bankName,
    accountNumber,
}: BankDetailsEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Bank Details Confirmation - COIN SPECTRUM</Preview>
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
                            Bank Details Received
                        </Heading>

                        <Section className="mb-6">
                            <Text className="mb-4">
                                Dear {userFirstName},
                            </Text>

                            <Text>Your bank details have been successfully received:</Text>

                            <div className="bg-gray-100 p-4 rounded-lg my-4">
                                <Text className="mb-2">
                                    <strong>Account Name:</strong> {accountHolderName}
                                </Text>
                                <Text className="mb-2">
                                    <strong>Bank Name:</strong> {bankName}
                                </Text>
                                <Text className="mb-2">
                                    <strong>Account Number:</strong> {accountNumber}
                                </Text>
                            </div>

                            <Text>We will verify these details shortly.</Text>
                        </Section>

                        <Section className="mt-8">
                            <Text className="text-sm text-gray-500">
                                Best regards,<br/>
                                Omnicom Finance Team
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    );
};
