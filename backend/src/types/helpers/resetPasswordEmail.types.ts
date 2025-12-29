export interface ResetPasswordEmailProps {
  email: string;
  name: string;
  maxRetries: number;
  baseDelayMs: number;
}
