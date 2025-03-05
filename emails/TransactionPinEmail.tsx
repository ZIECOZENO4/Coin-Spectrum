// components/emails/TransactionPinEmail.tsx
import {
    Html,
    Head,
    Preview,
    Body,
    Container,
    Section,
    Column,
    Row,
    Text,
    Img,
    Link,
    Hr,
    Button,
  } from '@react-email/components';
  
  interface TransactionPinEmailProps {
    userName: string;
    pin: string;
    isUpdate: boolean;
    timestamp: string;
  }
  
  export function TransactionPinEmail({
    userName,
    pin,
    isUpdate,
    timestamp,
  }: TransactionPinEmailProps) {
    return (
      <Html>
        <Head />
        <Preview>
          {isUpdate ? 'Transaction PIN Updated' : 'New Transaction PIN Created'}
        </Preview>
        <Body style={body}>
          <Container style={container}>
            <Section style={header}>
              <Img
                src="https://yourdomain.com/logo.png"
                width="120"
                height="40"
                alt="Company Logo"
                style={logo}
              />
              <Text style={headerText}>
                {isUpdate ? '🔒 PIN Updated' : '🔐 New Transaction PIN'}
              </Text>
            </Section>
  
            <Section style={content}>
              <Text style={paragraph}>Hi {userName},</Text>
              <Text style={paragraph}>
                Your transaction PIN has been {isUpdate ? 'updated' : 'created'} successfully.
                Here are your security details:
              </Text>
  
              <Section style={pinSection}>
                <Row style={pinRow}>
                  {pin.split('').map((digit, index) => (
                    <Column key={index} style={pinDigit}>
                      <Text style={pinText}>{digit}</Text>
                    </Column>
                  ))}
                </Row>
                <Text style={timestampText}>
                  Created at: {timestamp}
                </Text>
              </Section>
  
              <Text style={warningText}>
                ⚠️ This PIN will be required for all financial transactions.
                Never share your PIN with anyone.
              </Text>
  
              <Section style={buttonSection}>
                <Button
                  href="https://yourdomain.com/security"
                  style={button}
                >
                  Review Security Settings
                </Button>
              </Section>
            </Section>
  
            <Hr style={divider} />
  
            <Section style={footer}>
              <Text style={footerText}>
                Need help? Contact our support team at{' '}
                <Link href="mailto:support@yourdomain.com" style={link}>
                  support@yourdomain.com
                </Link>
              </Text>
              <Text style={footerText}>
                © {new Date().getFullYear()} Your Company Name. All rights reserved.
              </Text>
            </Section>
          </Container>
        </Body>
      </Html>
    );
  }
  
  // Inline styles for email compatibility
  const body = {
    backgroundColor: '#f6f6f6',
    fontFamily:
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    margin: 0,
    padding: '20px 0',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    margin: '0 auto',
    maxWidth: '600px',
    padding: '40px',
  };
  
  const header = {
    marginBottom: '30px',
    textAlign: 'center' as const,
  };
  
  const logo = {
    margin: '0 auto 20px',
  };
  
  const headerText = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  };
  
  const content = {
    padding: '0 20px',
  };
  
  const paragraph = {
    color: '#444444',
    fontSize: '16px',
    lineHeight: '24px',
    margin: '0 0 20px',
  };
  
  const pinSection = {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    margin: '30px 0',
    padding: '20px',
  };
  
  const pinRow = {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '15px',
  };
  
  const pinDigit = {
    backgroundColor: '#ffffff',
    borderRadius: '6px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    margin: '0 5px',
    padding: '12px',
    textAlign: 'center' as const,
    width: '50px',
  };
  
  const pinText = {
    color: '#1a1a1a',
    fontSize: '24px',
    fontWeight: 'bold',
    margin: 0,
  };
  
  const timestampText = {
    color: '#666666',
    fontSize: '12px',
    margin: '10px 0 0',
    textAlign: 'center' as const,
  };
  
  const warningText = {
    ...paragraph,
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #ffc107',
    color: '#856404',
    padding: '15px',
  };
  
  const buttonSection = {
    margin: '30px 0',
    textAlign: 'center' as const,
  };
  
  const button = {
    backgroundColor: '#2563eb',
    borderRadius: '6px',
    color: '#ffffff',
    display: 'inline-block',
    fontSize: '16px',
    fontWeight: 'bold',
    padding: '12px 30px',
    textDecoration: 'none',
  };
  
  const divider = {
    borderColor: '#e5e7eb',
    margin: '30px 0',
  };
  
  const footer = {
    padding: '0 20px',
  };
  
  const footerText = {
    color: '#666666',
    fontSize: '12px',
    lineHeight: '18px',
    margin: '0 0 10px',
    textAlign: 'center' as const,
  };
  
  const link = {
    color: '#2563eb',
    textDecoration: 'underline',
  };
  