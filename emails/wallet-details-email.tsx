// components/emails/wallet-details-email.tsx
import {
    Body,
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

interface WalletDetailsEmailProps {
    userFirstName: string;
    walletProvider: string;
    walletAddress: string;
    isAdminCopy?: boolean;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";

export const WalletDetailsEmail = ({
    userFirstName,
    walletProvider,
    walletAddress,
    isAdminCopy
}: WalletDetailsEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Wallet Details Confirmation - COIN SPECTRUM</Preview>
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
                            Wallet Details Received
                        </Heading>

                        <Section className="mb-6">
                            <Text className="mb-4">
                                {isAdminCopy 
                                    ? `Wallet details received from ${userFirstName}`
                                    : `Dear ${userFirstName},`
                                }
                            </Text>

                            <div className="bg-gray-100 p-4 rounded-lg my-4">
                                <Text className="mb-2">
                                    <strong>Wallet Provider:</strong> {walletProvider}
                                </Text>
                                <Text className="mb-2">
                                    <strong>Wallet Address:</strong> {walletAddress}
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
