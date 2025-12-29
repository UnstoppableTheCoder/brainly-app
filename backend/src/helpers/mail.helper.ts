import logger from "../config/logger.config.js";
import emailVerificationTemplate from "../mail/templates/emailVerification.template.js";
import forgotPasswordTemplate from "../mail/templates/forgotPassword.template.js";
import resetPasswordTemplate from "../mail/templates/resetPassword.template.js";
import mailSender from "../services/mail.service.js";
import type { ForgotPasswordEmailProps } from "../types/helpers/forgotPasswordEmail.types.js";
import type { MailHelperProps } from "../types/helpers/mailHelper.types.js";
import type { ResetPasswordEmailProps } from "../types/helpers/resetPasswordEmail.types.js";
import type { VerificationEmailProps } from "../types/helpers/verificationEmail.types.js";
import ApiError from "../utils/ApiError.js";

async function sendMailHelper({
  email,
  subject,
  text,
  html,
  maxRetries,
  baseDelayMs,
}: MailHelperProps) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const isSent = await mailSender(email, subject, text, html);
      if (isSent) return true;
    } catch (error) {
      logger.error(
        `Attempt ${attempt} failed to send email: `,
        error instanceof Error ? error.message : String(error)
      );
    }

    // Exponential backoff delay before next attempt
    const delay = baseDelayMs * Math.pow(2, attempt - 1);
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return false;
}

async function sendVerificationEmail({
  email,
  token,
  maxRetries,
  baseDelayMs,
}: VerificationEmailProps) {
  const verificationUrl = `${process.env.FRONTEND_BASE_URL}/verify/${token}`;

  const sendMailOptions = {
    email,
    subject: "Please verify your email address",
    text: `Thank you for signing up! Please verify your email address to complete your sign up.
        ${verificationUrl}
        This verification link will expire in 10 minutes.
        If you did not create an account, please ignore this email.
      `,
    html: emailVerificationTemplate(verificationUrl),
    maxRetries,
    baseDelayMs,
  };

  const isSent = sendMailHelper(sendMailOptions);
  return isSent;
}

async function sendForgotPasswordEmail({
  email,
  token,
  maxRetries,
  baseDelayMs,
}: ForgotPasswordEmailProps) {
  const frontendBaseUrl = process.env.FRONTEND_BASE_URL;
  if (!frontendBaseUrl) {
    throw new ApiError(
      400,
      "FRONTEND_BASE_URL is not present in environment variables"
    );
  }

  const forgotPasswordUrl = `${frontendBaseUrl}/reset-password/${token}`;

  const sendMailOptions = {
    email,
    subject: "Please change your password",
    text: `Please change your password by clicking on the given link.
        ${forgotPasswordUrl}
        This forgot password link will expire in 10 minutes.
        If you did not requested to change your password, please ignore this email.
      `,
    html: forgotPasswordTemplate(forgotPasswordUrl),
    maxRetries,
    baseDelayMs,
  };

  const isSent = sendMailHelper(sendMailOptions);
  return isSent;
}

async function sendResetPasswordEmail({
  email,
  name,
  maxRetries,
  baseDelayMs,
}: ResetPasswordEmailProps) {
  const sendMailOptions = {
    email,
    subject: "Reset Password Successfully",
    text: `Your password has been reset successfully, you can login using your new password`,
    html: resetPasswordTemplate(email, name),
    maxRetries,
    baseDelayMs,
  };

  const isSent = sendMailHelper(sendMailOptions);
  return isSent;
}

export {
  sendVerificationEmail,
  sendForgotPasswordEmail,
  sendResetPasswordEmail,
};
