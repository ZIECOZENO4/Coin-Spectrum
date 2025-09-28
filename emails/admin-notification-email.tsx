import React from 'react';

interface AdminNotificationEmailProps {
  action: 'ban' | 'unban' | 'delete';
  userName: string;
  userEmail: string;
  reason: string;
  adminName: string;
  timestamp: string;
}

export function AdminNotificationEmail({ 
  action,
  userName, 
  userEmail, 
  reason,
  adminName,
  timestamp
}: AdminNotificationEmailProps) {
  
  const getActionText = () => {
    switch (action) {
      case 'ban':
        return 'User Banned';
      case 'unban':
        return 'User Unbanned';
      case 'delete':
        return 'User Deleted';
      default:
        return 'User Action';
    }
  };

  const getActionIcon = () => {
    switch (action) {
      case 'ban':
        return '🚫';
      case 'unban':
        return '✅';
      case 'delete':
        return '🗑️';
      default:
        return '📋';
    }
  };

  const getActionColor = () => {
    switch (action) {
      case 'ban':
        return '#dc2626';
      case 'unban':
        return '#16a34a';
      case 'delete':
        return '#dc2626';
      default:
        return '#374151';
    }
  };
  
  return (
    <html>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Admin Action Notification - {getActionText()}</title>
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
            Admin Dashboard Notification
          </p>
        </div>

        {/* Main Content */}
        <div style={{ padding: '0 20px' }}>
          <h2 style={{ 
            color: getActionColor(),
            fontSize: '24px',
            marginBottom: '20px'
          }}>
            {getActionIcon()} {getActionText()}
          </h2>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            Dear <strong>Admin Team</strong>,
          </p>

          <p style={{ fontSize: '16px', marginBottom: '20px' }}>
            This is to notify you that a user account action has been performed by <strong>{adminName}</strong>.
          </p>

          {/* Action Details */}
          <div style={{ 
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ 
              color: '#1a1a1a',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Action Details:
            </h3>
            <table style={{ width: '100%', fontSize: '14px' }}>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#374151' }}>Action:</td>
                <td style={{ padding: '8px 0', color: '#374151' }}>{getActionText()}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#374151' }}>User Name:</td>
                <td style={{ padding: '8px 0', color: '#374151' }}>{userName}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#374151' }}>User Email:</td>
                <td style={{ padding: '8px 0', color: '#374151' }}>{userEmail}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#374151' }}>Performed By:</td>
                <td style={{ padding: '8px 0', color: '#374151' }}>{adminName}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold', color: '#374151' }}>Timestamp:</td>
                <td style={{ padding: '8px 0', color: '#374151' }}>{timestamp}</td>
              </tr>
            </table>
          </div>

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
              Reason Provided:
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

          {/* Impact Assessment */}
          <div style={{ 
            backgroundColor: '#f0f9ff',
            border: '1px solid #bae6fd',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ 
              color: '#0369a1',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Impact Assessment:
            </h3>
            <ul style={{ 
              fontSize: '14px',
              color: '#374151',
              margin: '0',
              paddingLeft: '20px'
            }}>
              {action === 'delete' ? (
                <>
                  <li>User account permanently removed from system</li>
                  <li>All user data and associated records deleted</li>
                  <li>No possibility of account recovery</li>
                  <li>User will receive deletion confirmation email</li>
                </>
              ) : action === 'ban' ? (
                <>
                  <li>User account access temporarily restricted</li>
                  <li>User cannot make new investments or withdrawals</li>
                  <li>Existing investments remain secure</li>
                  <li>User will receive ban notification email</li>
                </>
              ) : (
                <>
                  <li>User account access fully restored</li>
                  <li>All platform features available to user</li>
                  <li>Previous restrictions removed</li>
                  <li>User will receive restoration confirmation email</li>
                </>
              )}
            </ul>
          </div>

          {/* Next Steps */}
          <div style={{ 
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ 
              color: '#16a34a',
              fontSize: '18px',
              marginBottom: '15px'
            }}>
              Recommended Next Steps:
            </h3>
            <ul style={{ 
              fontSize: '14px',
              color: '#374151',
              margin: '0',
              paddingLeft: '20px'
            }}>
              <li>Monitor user's response to the action</li>
              <li>Review any support tickets from the affected user</li>
              <li>Document the action in admin logs</li>
              <li>Follow up if user contacts support</li>
              {action === 'ban' && <li>Set reminder to review ban status</li>}
            </ul>
          </div>

          <p style={{ fontSize: '14px', color: '#666', marginTop: '30px' }}>
            This notification was automatically generated by the Coin Spectrum admin system.
          </p>

          <p style={{ fontSize: '14px', color: '#666' }}>
            Best regards,<br />
            <strong>Coin Spectrum Admin System</strong>
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
            Admin Dashboard Notification System
          </p>
        </div>
      </body>
    </html>
  );
}
