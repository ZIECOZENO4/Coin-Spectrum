// components/emails/AdminNotificationEmail.tsx
import { Html, Head, Body, Container, Text, Heading } from "@react-email/components";

interface AdminNotificationEmailProps {
  newUserName: string;
  newUserEmail: string;
  signupDate: string;
}

export const AdminNotificationEmail = ({ 
  newUserName, 
  newUserEmail, 
  signupDate 
}: AdminNotificationEmailProps) => {
  return (
    <Html>
      <Head />
      <Body>
        <Container>
          <Heading>New User Registration</Heading>
          <Text>A new user has registered on Coin Spectrum:</Text>
          <Text>Name: {newUserName}</Text>
          <Text>Email: {newUserEmail}</Text>
          <Text>Signup Date: {signupDate}</Text>
        </Container>
      </Body>
    </Html>
  );
};
