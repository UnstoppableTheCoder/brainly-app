import logger from "../config/logger.config.js";
import transport from "../config/mail.config.js";

const mailSender = async (
  email: string,
  subject: string,
  text: string,
  html: string
) => {
  try {
    // Email Options
    const mailOptions = {
      from: "Brainly - Your Second Brain",
      to: email,
      subject,
      text,
      html,
    };

    // Send mail
    const info = await transport.sendMail(mailOptions);
    logger.info(`Verification email sent successfully: ${info.messageId}`);
    return true;
  } catch (error) {
    logger.error("Error sending verification email: ", error);
    return false;
  }
};

export default mailSender;
