"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const otp_verify_1 = __importDefault(require("otp-verify"));
otp_verify_1.default.setupSenderEmail({
    service: "gmail",
    user: "example@gmail.com",
    //for gmail, create an app password and use it
    pass: "app_password",
});
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.route("/sendOtp").post((req, res) => {
    try {
        otp_verify_1.default.sendOTP({
            to: "xyz@gmail.com",
            message: "Enter the below OTP for email validation",
            subject: "Email Verification",
        }, (err, otp) => {
            if (err)
                console.log(err);
            else
                console.log("Email sent", otp);
        });
        res.json("Otp Sent");
    }
    catch (err) {
        res.json("otp not sent due to error");
    }
});
