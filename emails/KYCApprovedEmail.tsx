// emails/KYCApprovedEmail.tsx
import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Text,
    Button,
    Section,
  } from '@react-email/components';
  
  interface KYCApprovedEmailProps {
    userFirstName: string;
    kycId: string;
    isAdminCopy?: boolean;
  }
  
  export const KYCApprovedEmail = ({
    userFirstName,
    kycId,
    isAdminCopy = false,
  }: KYCApprovedEmailProps) => {
    const previewText = isAdminCopy 
      ? `KYC Approved for ${userFirstName}`
      : 'Your KYC verification has been approved';
  
    return (
      <Html>
        <Head />
        <Preview>{previewText}</Preview>
        <Body style={main}>
          <Container style={container}>
            <Heading style={h1}>
              {isAdminCopy ? 'KYC Verification Approved' : 'Congratulations!'}
            </Heading>
            <Text style={text}>
              {isAdminCopy 
                ? `KYC verification for ${userFirstName} has been approved.`
                : `Dear ${userFirstName},`}
            </Text>
            <Text style={text}>
              {isAdminCopy 
                ? 'The user now has full access to all platform features.'
                : 'Your KYC verification has been successfully approved. You now have full access to all platform features.'}
            </Text>
            <Section style={buttonContainer}>
              <Button style={button} href="https://omnicom.com.im/account">
                {isAdminCopy ? 'View Admin Dashboard' : 'Go to Dashboard'}
              </Button>
            </Section>
            <Text style={footer}>
              <strong>Verification ID:</strong> {kycId}
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
    maxWidth: '580px',
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
  
  const buttonContainer = {
    margin: '24px 0',
  };
  
  const button = {
    backgroundColor: '#FFC107',
    borderRadius: '4px',
    color: '#000000',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: '600',
    padding: '12px 24px',
    textDecoration: 'none',
    textAlign: 'center' as const,
  };
  
  const reasonContainer = {
    backgroundColor: '#FFF3E0',
    borderRadius: '4px',
    margin: '16px 0',
    padding: '16px',
  };
  
  const reasonText = {
    color: '#E65100',
    margin: '0',
  };
  
  const footer = {
    color: '#6B7280',
    fontSize: '14px',
    margin: '24px 0 0',
  };
  