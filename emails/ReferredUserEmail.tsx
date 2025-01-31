// components/emails/ReferralOwnerEmail.tsx
import { 
    Body,
    Container,
    Head,
    Heading,
    Html,
    Img,
    Preview,
    Section,
    Text 
  } from '@react-email/components';
  
 

  interface ReferredUserEmailProps {
    userName: string;
    referrerName: string;
    date: string;
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";
  
  export const ReferredUserEmail = ({
    userName,
    referrerName,
    date,
  }: ReferredUserEmailProps) => (
    <Html>
      <Head />
      <Preview>Welcome to Coin Spectrum!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
             src={`${baseUrl}/logo.png`}
            width="150"
            height="50"
            alt="Coin Spectrum"
            style={logo}
          />
          <Heading style={heading}>Welcome to Coin Spectrum, {userName}!</Heading>
          <Section style={section}>
            <Text style={text}>
              You've been referred by {referrerName}. We're excited to have you join our platform!
            </Text>
            <Text style={text}>
              Date: {new Date(date).toLocaleDateString()}
            </Text>
            <Text style={text}>
              Start exploring our features and check out our special investment opportunities.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
  
  const main = {
    backgroundColor: '#f6f9fc',
    fontFamily: 
      '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: '40px 0',
  };
  
  const container = {
    backgroundColor: '#ffffff',
    border: '1px solid #f0f0f0',
    borderRadius: '10px',
    margin: '0 auto',
    padding: '40px',
    maxWidth: '600px',
  };
  
  const logo = {
    margin: '0 auto',
    marginBottom: '24px',
    display: 'block',
  };
  
  const heading = {
    color: '#1f2937',
    fontSize: '24px',
    fontWeight: '600',
    lineHeight: '1.3',
    textAlign: 'center' as const,
    margin: '30px 0',
  };
  
  const section = {
    margin: '24px 0',
  };
  
  const text = {
    color: '#374151',
    fontSize: '16px',
    lineHeight: '24px',
    textAlign: 'left' as const,
    margin: '16px 0',
  };
  