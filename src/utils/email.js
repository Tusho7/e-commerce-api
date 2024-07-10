import nodemailer from "nodemailer";
import { configDotenv } from "dotenv";

configDotenv();
const sendVerificationEmail = async (email, verificationCode) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: email,
    subject: "გთხოვთ დაადასტუროთ ელ-ფოსტა",
    html: `
        <p>მადლობა რომ დარეგისტრირდით ჩვენს ვებსაიტზე.</p>
        <p>გთხოვთ დაადასტუროთ ელ-ფოსტა მოცემული კოდით:</p>
        <h1 style="font-size: 24px; font-weight: bold;">${verificationCode}</h1>
      `,
  };
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
};

export default sendVerificationEmail;