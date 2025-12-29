export interface MailHelperProps {
  email: string;
  subject: string;
  text: string;
  html: string;
  maxRetries: number;
  baseDelayMs: number;
}
