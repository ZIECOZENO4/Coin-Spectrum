// emails/ReferralEmail.tsx
interface ReferralEmailProps {
    referrerName: string;
    newUserName: string;
    date: string;
  }
  
  export const ReferralEmail = ({
    referrerName,
    newUserName,
    date,
  }: ReferralEmailProps) => (
    <div>
      <h1>Hello {referrerName}!</h1>
      <p>Great news! {newUserName} just signed up using your referral link.</p>
      <p>Date: {new Date(date).toLocaleDateString()}</p>
    </div>
  );
  