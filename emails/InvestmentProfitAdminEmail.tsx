import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Img,
  Preview,
  Section,
  Text,
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface InvestmentProfitAdminEmailProps {
  adminName: string;
  userName: string;
  userEmail: string;
  profitAmount: string;
  investmentName: string;
  userInvestmentId: string;
  companyName: string;
  companyLogoUrl: string;
}

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const InvestmentProfitAdminEmail = ({
  adminName,
  userName,
  userEmail,
  profitAmount,
  investmentName,
  userInvestmentId,
  companyName,
  companyLogoUrl,
}: InvestmentProfitAdminEmailProps) => (
  <Html>
    <Head />
    <Preview>Investment Profit Payout Processed</Preview>
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
        <Heading style={h1}>Admin Notification: Profit Payout</Heading>
        <Text style={text}>Hello {adminName},</Text>
        <Text style={text}>
          This email is to confirm that an investment profit payout has been
          processed for a user.
        </Text>
        <Section style={detailsSection}>
          <Heading style={h2}>Payout Details:</Heading>
          <Row style={detailRow}>
            <Column style={detailHeader}>User Name:</Column>
            <Column style={detailValue}>{userName}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>User Email:</Column>
            <Column style={detailValue}>{userEmail}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>Investment Name:</Column>
            <Column style={detailValue}>{investmentName}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>User Investment ID:</Column>
            <Column style={detailValue}>{userInvestmentId}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>Profit Amount Paid:</Column>
            <Column style={detailValue}>${profitAmount}</Column>
          </Row>
          <Row style={detailRow}>
            <Column style={detailHeader}>Processed At:</Column>
            <Column style={detailValue}>{new Date().toLocaleString()}</Column>
          </Row>
        </Section>
        <Text style={text}>
          The user's balance has been updated accordingly, and a transaction
          record has been created.
        </Text>
        <Hr style={hr} />
        <Text style={footerText}>
          This is an automated notification from the {companyName} system.
        </Text>
      </Container>
    </Body>
  </Html>
);

export default InvestmentProfitAdminEmail;

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

const h2 = {
  color: "#444",
  fontSize: "18px",
  fontWeight: "bold",
  margin: "0 0 15px 0",
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
  padding: "20px",
  margin: "20px",
  borderRadius: "5px",
  border: "1px solid #dfe7ef",
};

const detailRow = {
  marginBottom: "10px",
};

const detailHeader = {
  fontSize: "14px",
  color: "#525f7f",
  width: "150px",
  paddingRight: "10px",
};

const detailValue = {
  fontSize: "14px",
  color: "#333",
  fontWeight: "500",
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