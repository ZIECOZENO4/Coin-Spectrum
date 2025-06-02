import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface InvestmentProfitUserEmailProps {
  userFirstName: string;
  profitAmount: string;
  investmentName: string;
  companyName: string;
  companyLogoUrl: string;
  copyrightText: string;
  contactNumber: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const InvestmentProfitUserEmail = ({
  userFirstName,
  profitAmount,
  investmentName,
  companyName,
  companyLogoUrl,
  copyrightText,
  contactNumber,
}: InvestmentProfitUserEmailProps) => (
  <Html>
    <Head />
    <Preview>Your Investment Profit has been Credited!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={logoContainer}>
          <Img
                src={`${baseUrl}/images/cs.png`}
            width="150"
            height="auto"
            alt={`${companyName} Logo`}
            style={logo}
          />
        </Section>
        <Heading style={h1}>Investment Profit Credited!</Heading>
        <Text style={text}>Hello {userFirstName},</Text>
        <Text style={text}>
          We are pleased to inform you that a profit of{" "}
          <strong>${profitAmount}</strong> from your investment in{" "}
          <strong>{investmentName}</strong> has been successfully credited to
          your account balance.
        </Text>
        <Section style={detailsSection}>
          <Row style={detailRow}>
            <Column style={detailHeader}>Investment:</Column>
            <Column style={detailValue}>{investmentName}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>Profit Amount:</Column>
            <Column style={detailValue}>${profitAmount}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>Date:</Column>
            <Column style={detailValue}>{new Date().toLocaleDateString()}</Column>
          </Row>
        </Section>
        <Text style={text}>
          You can view your updated balance and transaction history by logging
          into your dashboard.
        </Text>
        <Section style={buttonContainer}>
          <Link style={button} href={`${baseUrl}/dashboard`}>
            Go to Dashboard
          </Link>
        </Section>
        <Hr style={hr} />
        <Text style={footerText}>
          If you have any questions or did not expect this, please contact our
          support team immediately.
        </Text>
        <Text style={footerText}>
          {companyName} <br />
          {contactNumber} <br />
          {copyrightText}
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvestmentProfitUserEmail;

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  border: "1px solid #e6ebf1",
  borderRadius: "5px",
};

const logoContainer = {
  textAlign: "center" as const,
  margin: "20px 0",
};

const logo = {
  margin: "0 auto",
};

const h1 = {
  color: "#333",
  fontSize: "24px",
  fontWeight: "bold",
  textAlign: "center" as const,
  margin: "30px 0",
  padding: "0",
};

const text = {
  color: "#525f7f",
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "left" as const,
  padding: "0 20px",
};

const detailsSection = {
  backgroundColor: "#f0f4f8",
  padding: "15px",
  margin: "20px",
  borderRadius: "5px",
};

const detailRow = {
  marginBottom: "8px",
};

const detailHeader = {
  fontSize: "14px",
  color: "#525f7f",
  width: "120px",
};

const detailValue = {
  fontSize: "14px",
  color: "#333",
  fontWeight: "bold",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "32px 0",
};

const button = {
  backgroundColor: "#007bff",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "12px 20px",
};

const hr = {
  borderColor: "#e6ebf1",
  margin: "20px 0",
};

const footerText = {
  color: "#8898aa",
  fontSize: "12px",
  lineHeight: "16px",
  textAlign: "center" as const,
  padding: "0 20px",
};