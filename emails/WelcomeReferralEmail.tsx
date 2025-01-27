

interface WelcomeReferralEmailProps {
    userName: string;
    referrerName: string;
    date: string;
  }
  
  export const WelcomeReferralEmail = ({
    userName,
    referrerName,
    date,
  }: WelcomeReferralEmailProps) => (
    <div>
      <h1>Welcome {userName}!</h1>
      <p>You've been referred by {referrerName}. Welcome to Coin Spectrum!</p>
      <p>Date: {new Date(date).toLocaleDateString()}</p>
    </div>
  );
  