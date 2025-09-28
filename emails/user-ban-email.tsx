import React from 'react';

interface UserBanEmailProps {
  userName: string;
  userEmail: string;
  reason: string;
  action: 'ban' | 'unban';
  adminName?: string;
}

export function UserBanEmail({ 
  userName, 
  userEmail, 
  reason, 
  action,
  adminName = 'Coin Spectrum Support Team'
}: UserBanEmailProps) {
  const isBan = action === 'ban';
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{isBan ? 'Account Suspended' : 'Account Restored'} - Coin Spectrum</title>
      </head>
      <body style={{ 
        fontFamily: 'Arial, sans-serif', 
        lineHeight: '1.6', 
        color: '#333',
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px'
      }}>
        {/* Header with Logo */}
        <div style={{ 
          textAlign: 'center', 
          padding: '20px 0',
          borderBottom: '2px solid #f0f0f0',
          marginBottom: '30px'
        }}>
          <h1 style={{ 
            color: '#1a1a1a',
            fontSize: '28px',
            margin: '0',
            fontWeight: 'bold'
          }}>
            🚀 Coin Spectrum
          </h1>
          <p style={{ 
            color: '#666',
            fontSize: '14px',
            margin: '5px 0 0 0'
          }}>
            Your Trusted Crypto Investment Platform
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '0 20px' }}>
          <h2 style={{ 
            color: isBan ? '#dc2626' : '#16a34a',
            fontSize: '24px',
            marginBottom: '20px'
          }}>
            {isBan ? '⚠️ Account Suspended' : '✅ Account Restored'}
          </h2>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Dear <strong>User</strong>,
          </p>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            {isBan 
              ? 'We are writing to inform you that your Coin Spectrum account has been temporarily suspended.'
              : 'We are pleased to inform you that your Coin Spectrum account has been restored and is now fully active.'
            }
          </p>

          {/* Reason Section */}
          <div style={{ 
            backgroundColor: isBan ? '#fef2f2' : '#f0fdf4',
            border: `1px solid ${isBan ? '#fecaca' : '#bbf7d0'}`,
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ 
              color: isBan ? '#dc2626' : '#16a34a',
              fontSize: '18px',
              marginBottom: '10px'
            }}>
              {isBan ? 'Reason for Suspension:' : 'Reason for Restoration:'}
            </h3>
            <p style={{ 
              fontSize: '14px',
              color: '#374151',
              margin: '0',
              fontStyle: 'italic'
            }}>
              "{reason}"
            </p>
          </div>

          {isBan ? (
            <>
              <h3 style={{ color: '#dc2626', fontSize: '18px', marginBottom: '15px' }}>
                What This Means:
              </h3>
              <ul style={{ 
                fontSize: '14px',
                color: '#374151',
                marginBottom: '20px',
                paddingLeft: '20px'
              }}>
                <li>Your account access has been temporarily restricted</li>
                <li>You cannot make new investments or withdrawals</li>
                <li>Your existing investments remain secure</li>
                <li>You can still view your account information</li>
              </ul>

              <h3 style={{ color: '#dc2626', fontSize: '18px', marginBottom: '15px' }}>
                Next Steps:
              </h3>
              <ul style={{ 
                fontSize: '14px',
                color: '#374151',
                marginBottom: '20px',
                paddingLeft: '20px'
              }}>
                <li>Review our Terms of Service and Community Guidelines</li>
                <li>Contact our support team if you believe this is an error</li>
                <li>Provide any additional information requested by our team</li>
                <li>Wait for our review and potential account restoration</li>
                {reason.toLowerCase().includes('dormant') && (
                  <li>Consider making a deposit or investment to reactivate your account</li>
                )}
                {reason.toLowerCase().includes('deposit') && (
                  <li>Make a deposit to your account to restore full access</li>
                )}
              </ul>
            </>
          ) : (
            <>
              <h3 style={{ color: '#16a34a', fontSize: '18px', marginBottom: '15px' }}>
                Your Account is Now Active:
              </h3>
              <ul style={{ 
                fontSize: '14px',
                color: '#374151',
                marginBottom: '20px',
                paddingLeft: '20px'
              }}>
                <li>Full access to all platform features</li>
                <li>Ability to make new investments</li>
                <li>Withdrawal and deposit capabilities restored</li>
                <li>All previous account privileges reinstated</li>
              </ul>
            </>
          )}

          {/* Support Information */}
          <div style={{ 
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            margin: '30px 0'
          }}>
            <h3 style={{ 
              color: '#1a1a1a',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Need Help?
            </h3>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '10px' }}>
              If you have any questions or concerns, please don't hesitate to contact our support team:
            </p>
            <ul style={{ 
              fontSize: '14px',
              color: '#374151',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>Email: support@coinspectrum.net</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Live Chat: Available 24/7 on our platform</li>
            </ul>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            Thank you for your understanding and continued trust in Coin Spectrum.
          </p>

          <p style={{ fontSize: '14px', color: '#666' }}>
            Best regards,<br />
            <strong>{adminName}</strong><br />
            Coin Spectrum Support Team
          </p>
        </div>

        {/* Footer */}
        <div style={{ 
          textAlign: 'center',
          padding: '20px 0',
          borderTop: '1px solid #f0f0f0',
          marginTop: '30px',
          fontSize: '12px',
          color: '#666'
        }}>
          <p>
            © 2024 Coin Spectrum. All rights reserved.<br />
            This email was sent to {userEmail}
          </p>
        </div>
      </body>
    </html>
  );
}
