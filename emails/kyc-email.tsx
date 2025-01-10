// emails/kyc-email.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
  } from '@react-email/components';
  
  interface KYCEmailProps {
    userFirstName: string;
    status: string;
    submissionDate: string;
    kycId: string;
    isAdminCopy?: boolean;
  }
  
  export const KYCEmail = ({
    userFirstName,
    status,
    submissionDate,
    kycId,
    isAdminCopy = false,
  }: KYCEmailProps) => {
    const previewText = isAdminCopy 
      ? `New KYC submission from ${userFirstName}`
      : 'Your KYC submission has been received';
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>
              {isAdminCopy ? 'New KYC Submission' : 'KYC Submission Confirmation'}
            </Heading>
            <Text style={text}>
              {isAdminCopy 
                ? `A new KYC submission has been received from ${userFirstName}`
                : `Dear ${userFirstName},`}
            </Text>
            <Text style={text}>
              {isAdminCopy 
                ? 'Please review the submission at your earliest convenience.'
                : 'Your KYC documents have been successfully submitted for verification.'}
            </Text>
            <Text style={text}>
              <strong>Submission ID:</strong> {kycId}<br />
              <strong>Status:</strong> {status}<br />
              <strong>Date:</strong> {submissionDate}
            </Text>
            <Text style={text}>
              {isAdminCopy 
                ? 'Login to the admin dashboard to process this submission.'
                : 'We will notify you once your documents have been verified.'}
            </Text>
          </Container>
        </Body>
      </Html>
    );
  };
  
  const main = {
    backgroundColor: '#ffffff',
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
  };
  
  const container = {
    margin: '0 auto',
    padding: '20px 0 48px',
  };
  
  const h1 = {
    color: '#1d1c1d',
    fontSize: '24px',
    fontWeight: '700',
    lineHeight: '1.4',
    margin: '0 0 24px',
  };
  
  const text = {
    color: '#1d1c1d',
    fontSize: '16px',
    lineHeight: '1.4',
    margin: '12px 0',
  };
  