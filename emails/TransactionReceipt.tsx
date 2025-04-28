import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { formatCurrency } from "@/lib/formatCurrency";

interface TransactionReceiptEmailProps {
  id: string;
  type: string;
  amount: number;
  date: Date;
  description: string;
  direction?: "IN" | "OUT";
  userEmail: string;
  userName: string;
}

export const TransactionReceiptEmail = ({
  id,
  type,
  amount,
  date,
  description,
  direction,
  userEmail,
  userName,
}: TransactionReceiptEmailProps) => {
  const previewText = `Your ${type.toLowerCase()} receipt for ${formatCurrency(amount)}`;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
    ? `${process.env.NEXT_PUBLIC_APP_URL}`
    : "https://www.coinspectrum.net/";

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src={`${baseUrl}/images/cs.png`}
            width="80"
            height="80"
            alt="Digital Fortress"
            style={logo}
          />
          <Heading style={heading}>Transaction Receipt</Heading>
          <Text style={paragraph}>Dear {userName},</Text>
          <Text style={paragraph}>
            Thank you for using Digital Fortress. Here's your transaction receipt:
          </Text>
          <Section style={tableContainer}>
            <table style={table}>
              <tbody>
                <tr>
                  <td style={tableCellLeft}>Transaction ID:</td>
                  <td style={tableCellRight}>{id}</td>
                </tr>
                <tr>
                  <td style={tableCellLeft}>Type:</td>
                  <td style={tableCellRight}>{type}</td>
                </tr>
                <tr>
                  <td style={tableCellLeft}>Description:</td>
                  <td style={tableCellRight}>{description}</td>
                </tr>
                <tr>
                  <td style={tableCellLeft}>Amount:</td>
                  <td style={tableCellRight}>
                    <span style={direction === "IN" ? { color: "#16a34a" } : { color: "#dc2626" }}>
                      {direction === "IN" ? "+" : "-"}
                      {formatCurrency(amount)}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style={tableCellLeft}>Date:</td>
                  <td style={tableCellRight}>
                    {new Date(date).toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </Section>
          <Text style={paragraph}>
            If you have any questions, please contact our support team at{" "}
            <Link href="mailto:support@digitalfortress.com">
              support@digitalfortress.com
            </Link>
          </Text>
          <Text style={footer}>
            Best regards,
            <br />
            Digital Fortress Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

export default TransactionReceiptEmail;

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "24px",
};

const heading = {
  fontSize: "24px",
  letterSpacing: "-0.5px",
  lineHeight: "1.3",
  fontWeight: "400",
  color: "#484848",
  padding: "17px 0 0",
  textAlign: "center" as const,
};

const paragraph = {
  margin: "0 0 15px",
  fontSize: "15px",
  lineHeight: "1.4",
  color: "#3c4149",
};

const tableContainer = {
  padding: "20px 0",
};

const table = {
  width: "100%",
  borderCollapse: "collapse" as const,
};

const tableCellLeft = {
  padding: "10px 0",
  fontSize: "15px",
  color: "#3c4149",
  fontWeight: "500",
};

const tableCellRight = {
  padding: "10px 0",
  fontSize: "15px",
  color: "#3c4149",
  textAlign: "right" as const,
};

const footer = {
  ...paragraph,
  marginTop: "20px",
  textAlign: "center" as const,
}; 