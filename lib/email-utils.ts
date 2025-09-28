import { Resend } from 'resend';
import React from 'react';
import { UserBanEmail } from '@/emails/user-ban-email';
import { UserDeleteEmail } from '@/emails/user-delete-email';
import { AdminNotificationEmail } from '@/emails/admin-notification-email';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendBanEmailProps {
  userName: string;
  userEmail: string;
  reason: string;
  action: 'ban' | 'unban';
  adminName?: string;
}

interface SendDeleteEmailProps {
  userName: string;
  userEmail: string;
  reason: string;
  adminName?: string;
}

interface SendAdminNotificationProps {
  action: 'ban' | 'unban' | 'delete';
  userName: string;
  userEmail: string;
  reason: string;
  adminName: string;
  adminEmail: string;
}

export async function sendBanEmail({
  userName,
  userEmail,
  reason,
  action,
  adminName = 'Coin Spectrum Support Team'
}: SendBanEmailProps) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is missing');
    }

    const emailComponent = React.createElement(UserBanEmail, {
      userName,
      userEmail,
      reason,
      action,
      adminName
    });

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@coinspectrum.net',
      to: userEmail,
      subject: action === 'ban' ? 'Account Suspended - Coin Spectrum' : 'Account Restored - Coin Spectrum',
      react: emailComponent
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending ban email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function sendDeleteEmail({
  userName,
  userEmail,
  reason,
  adminName = 'Coin Spectrum Support Team'
}: SendDeleteEmailProps) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is missing');
    }

    const emailComponent = React.createElement(UserDeleteEmail, {
      userName,
      userEmail,
      reason,
      adminName
    });

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@coinspectrum.net',
      to: userEmail,
      subject: 'Account Deletion Confirmation - Coin Spectrum',
      react: emailComponent
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending delete email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function sendAdminNotification({
  action,
  userName,
  userEmail,
  reason,
  adminName,
  adminEmail
}: SendAdminNotificationProps) {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('Resend API key is missing');
    }

    const timestamp = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });

    const emailComponent = React.createElement(AdminNotificationEmail, {
      action,
      userName,
      userEmail,
      reason,
      adminName,
      timestamp
    });

    const result = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'noreply@coinspectrum.net',
      to: adminEmail,
      subject: `Admin Action: ${action === 'ban' ? 'User Banned' : action === 'unban' ? 'User Unbanned' : 'User Deleted'} - ${userName}`,
      react: emailComponent
    });

    return { success: true, data: result };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Failed to send email' 
    };
  }
}

export async function sendUserActionEmails({
  action,
  userName,
  userEmail,
  reason,
  adminName,
  adminEmail
}: SendAdminNotificationProps & { adminEmail: string }) {
  try {
    const results = [];

    // Send email to user
    if (action === 'delete') {
      const userResult = await sendDeleteEmail({
        userName,
        userEmail,
        reason,
        adminName
      });
      results.push({ type: 'user', result: userResult });
    } else {
      const userResult = await sendBanEmail({
        userName,
        userEmail,
        reason,
        action: action as 'ban' | 'unban',
        adminName
      });
      results.push({ type: 'user', result: userResult });
    }

    // Send notification to admin
    const adminResult = await sendAdminNotification({
      action,
      userName,
      userEmail,
      reason,
      adminName,
      adminEmail
    });
    results.push({ type: 'admin', result: adminResult });

    return {
      success: true,
      results,
      message: 'All emails sent successfully'
    };
  } catch (error) {
    console.error('Error sending user action emails:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send emails'
    };
  }
}
