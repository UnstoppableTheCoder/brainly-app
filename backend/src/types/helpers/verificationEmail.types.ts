export interface VerificationEmailProps {
  email: string;
  token: string;
  maxRetries: number;
  baseDelayMs: number;
}
