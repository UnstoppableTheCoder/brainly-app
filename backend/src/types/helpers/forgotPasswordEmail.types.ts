export interface ForgotPasswordEmailProps {
  email: string;
  token: string;
  maxRetries: number;
  baseDelayMs: number;
}
