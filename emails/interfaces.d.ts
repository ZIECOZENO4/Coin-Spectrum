// node_modules/resend/build/src/emails/interfaces.d.ts
export interface CreateEmailOptions {
    from: string;
    to: string | string[];
    cc?: string | string[];
    bcc?: string | string[];
    reply_to?: string | string[];
    subject: string;
    text?: string;
    html?: string;
    react?: React.ReactElement;
    attachments?: Array<{
      content?: string | Buffer;
      filename?: string | string;
      path?: string;
    }>;
    tags?: Array<{
      name: string;
      value: string;
    }>;
    headers?: Record<string, string>;
    priority?: 'normal' | 'high';
  }
  