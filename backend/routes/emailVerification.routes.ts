import { Request, Response, response } from "express";
import RequestModel from "../models/Request.model";
import express from "express";
import OTP from "../models/OTP.model";
import {
  generateOTP,
  hashData,
  verifyHashData,
  sendEmail,
} from "../utils/helpers";
const { AUTH_EMAIL } = process.env;
import ResponseModel from "../models/Response.model";
const router = express();

router.route("/sendOTP").post((req: Request, res: Response) => {
  const sendOTP = async ({
    email,
    subject = "Authorization",
    message = "mail verification",
    duration = 1,
  }: {
    email: string;
    subject: string;
    message: string;
    duration: number;
  }) => {
    try {
      if (!(email && subject && message)) {
        throw Error("Provide values for email, subject, message");
      }

      // clear any old record
      await OTP.deleteOne({ email });

      // generate pin
      const generatedOTP = await generateOTP();

      // send email
      const mailOptions = {
        from: AUTH_EMAIL,
        to: email,
        subject,
        html: `<p>${message}</p>
                   <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p>
                   <p>This code <b>expires in 5 minutes </b>.</p>`,
      };
      await sendEmail(mailOptions);

      // save OTP record
      const hashedOTP = await hashData(generatedOTP);
      const newOTP = await new OTP({
        email,
        otp: hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 3600000 * +duration,
      });

      const createdOTPRecord = await newOTP.save();
      return createdOTPRecord;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  const duration = 5 / 60;

  const { email, subject, message } = req.body;
  sendOTP({ email, subject, message, duration })
    .then(() => {
      res.json({ status: true, message: "OTP sent successfully" });
    })
    .catch(() => {
      res.json({ status: false, message: "error in sending OTP" });
    });
});

router.route("/verifyOTP").post(async (req: Request, res: Response) => {
  const verifyOTP = async ({ email, otp }: { email: string; otp: string }) => {
    try {
      if (!(email && otp)) {
        throw Error("Provide values for email, otp");
      }

      // ensure otp record exists
      const matchedOTPRecord = await OTP.findOne({ email });

      if (!matchedOTPRecord) {
        throw Error("No otp records found.");
      }

      const { expiresAt } = matchedOTPRecord;

      //checking for expired code
      if (expiresAt < Date.now()) {
        await OTP.deleteOne({ email });
        throw Error("Code has expired. Request for the new one");
      }

      // not expired yet, verify value
      const hashedOTP = matchedOTPRecord.otp;
      const validOTP = await verifyHashData(otp, hashedOTP);
      return validOTP;
    } catch (e) {
      throw e;
    }
  };

  const { email, otp } = req.body;

  verifyOTP({ email, otp })
    .then((verified) => {
      if (verified) {
        res.json({ status: true, message: "OTP verified" });
      } else {
        res.json({ status: false, message: "OTP not verified verified" });
      }
    })
    .catch((e) => {
      res.json({ status: false, message: "error in verifying OTP" });
    });
});

const deleteOTP = async (email: string) => {
  try {
    await OTP.deleteOne({ email });
  } catch (e) {
    throw e;
  }
};
export default router;
