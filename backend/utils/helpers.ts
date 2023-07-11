import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import dotenv from "dotenv";
dotenv.config();
const { AUTH_EMAIL, AUTH_PASS } = process.env;

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  auth: {
    user: AUTH_EMAIL,
    pass: AUTH_PASS,
  },
});

// test transporter
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for message");
  }
});

export const sendEmail = async (mailOptions: any) => {
  try {
    await transporter.sendMail(mailOptions);
    return;
  } catch (e) {
    throw e;
  }
};

export const generateOTP = async () => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
    return otp;
  } catch (e) {
    throw e;
  }
};

import bcrypt from "bcrypt";

export const hashData = async (data: string, saltRounds = 10) => {
  try {
    const hashedData = await bcrypt.hash(data, saltRounds);
    return hashedData;
  } catch (e) {
    throw e;
  }
};

export const verifyHashData = async (unhashed: string, hashed: string) => {
  try {
    const match = await bcrypt.compare(unhashed, hashed);
    return match;
  } catch (e) {
    throw e;
  }
};
