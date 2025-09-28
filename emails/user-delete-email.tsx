import React from 'react';

interface UserDeleteEmailProps {
  userName: string;
  userEmail: string;
  reason: string;
  adminName?: string;
}

export function UserDeleteEmail({ 
  userName, 
  userEmail, 
  reason,
  adminName = 'Coin Spectrum Support Team'
}: UserDeleteEmailProps) {
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Account Deletion Confirmation - Coin Spectrum</title>
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
            color: '#dc2626',
            fontSize: '24px',
            marginBottom: '20px'
          }}>
            🗑️ Account Deletion Confirmation
          </h2>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Dear <strong>User</strong>,
          </p>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            We are writing to inform you that your Coin Spectrum account has been permanently deleted from our system. This action was taken by our administrative team and cannot be reversed.
          </p>

          {/* Reason Section */}
          <div style={{ 
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ 
              color: '#dc2626',
              fontSize: '18px',
              marginBottom: '10px'
            }}>
              Reason for Account Deletion:
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

          <h3 style={{ color: '#dc2626', fontSize: '18px', marginBottom: '15px' }}>
            What This Means:
          </h3>
          <ul style={{ 
            fontSize: '14px',
            color: '#374151',
            marginBottom: '20px',
            paddingLeft: '20px'
          }}>
            <li>Your account and all associated data have been permanently removed</li>
            <li>All personal information has been deleted from our systems</li>
            <li>You will no longer receive any communications from Coin Spectrum</li>
            <li>Any remaining funds (if applicable) have been processed according to our policies</li>
            <li>You cannot create a new account using the same email address</li>
          </ul>

          <h3 style={{ color: '#dc2626', fontSize: '18px', marginBottom: '15px' }}>
            Data Deletion Details:
          </h3>
          <ul style={{ 
            fontSize: '14px',
            color: '#374151',
            marginBottom: '20px',
            paddingLeft: '20px'
          }}>
            <li>Personal information and profile data</li>
            <li>Investment history and transaction records</li>
            <li>Communication logs and support tickets</li>
            <li>Account preferences and settings</li>
            <li>All associated documents and verification files</li>
          </ul>

          {/* Important Notice */}
          <div style={{ 
            backgroundColor: '#fef3c7',
            border: '1px solid #fbbf24',
            borderRadius: '8px',
            padding: '20px',
            margin: '30px 0'
          }}>
            <h3 style={{ 
              color: '#92400e',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              ⚠️ Important Notice
            </h3>
            <p style={{ 
              fontSize: '14px',
              color: '#92400e',
              margin: '0',
              fontWeight: 'bold'
            }}>
              This action is irreversible. If you believe this deletion was made in error, 
              please contact our support team immediately. However, please note that account 
              recovery may not be possible depending on the circumstances.
            </p>
          </div>

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
              Questions or Concerns?
            </h3>
            <p style={{ fontSize: '14px', color: '#374151', marginBottom: '10px' }}>
              If you have any questions about this account deletion, please contact our support team:
            </p>
            <ul style={{ 
              fontSize: '14px',
              color: '#374151',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>Email: support@coinspectrum.net</li>
              <li>Phone: +1 (555) 123-4567</li>
              <li>Subject: Account Deletion Inquiry - {userEmail}</li>
            </ul>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            We appreciate your past engagement with Coin Spectrum and wish you well in your future endeavors.
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
