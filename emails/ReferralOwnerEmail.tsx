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
  
  interface ReferralOwnerEmailProps {
    ownerName: string;
    referredUserEmail: string;
    date: string;
  }
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://yoursite.com";
  export const ReferralOwnerEmail = ({
    ownerName,
    referredUserEmail,
    date,
  }: ReferralOwnerEmailProps) => (
    <Html>
      <Head />
      <Preview>New Referral Registration on Coin Spectrum</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://your-domain.com/logo.png"
            width="150"
            height="50"
            alt="Coin Spectrum"
            style={logo}
          />
          <Heading style={heading}>Hello {ownerName}!</Heading>
          <Section style={section}>
            <Text style={text}>
              Great news! Someone has used your referral link to join Coin Spectrum.
            </Text>
            <Text style={text}>
              New member email: {referredUserEmail}
            </Text>
            <Text style={text}>
              Date: {new Date(date).toLocaleDateString()}
            </Text>
            <Text style={text}>
              Thank you for growing our community!
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
  