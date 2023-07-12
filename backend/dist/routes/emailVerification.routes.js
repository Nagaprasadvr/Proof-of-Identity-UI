"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const OTP_model_1 = __importDefault(require("../models/OTP.model"));
const helpers_1 = require("../utils/helpers");
const { AUTH_EMAIL } = process.env;
const router = (0, express_1.default)();
router.route("/sendOTP").post((req, res) => {
    const sendOTP = ({ email, subject = 'Authorization', message = 'mail verification', duration = 1, }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!(email && subject && message)) {
                throw Error("Provide values for email, subject, message");
            }
            // clear any old record
            yield OTP_model_1.default.deleteOne({ email });
            // generate pin
            const generatedOTP = yield (0, helpers_1.generateOTP)();
            // send email
            const mailOptions = {
                from: AUTH_EMAIL,
                to: email,
                subject,
                html: `<p>${message}</p>
                   <p style="color: tomato; font-size:25px; letter-spacing: 2px;"><b>${generatedOTP}</b></p>
                   <p>This code <b>expires in 5 minutes </b>.</p>`,
            };
            yield (0, helpers_1.sendEmail)(mailOptions);
            // save OTP record
            const hashedOTP = yield (0, helpers_1.hashData)(generatedOTP);
            const newOTP = yield new OTP_model_1.default({
                email,
                otp: hashedOTP,
                createdAt: Date.now(),
                expiresAt: Date.now() + 3600000 * +duration,
            });
            const createdOTPRecord = yield newOTP.save();
            return createdOTPRecord;
        }
        catch (e) {
            throw e;
        }
    });
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
router.route("/verifyOTP").post((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const verifyOTP = ({ email, otp }) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (!(email && otp)) {
                throw Error("Provide values for email, otp");
            }
            // ensure otp record exists
            const matchedOTPRecord = yield OTP_model_1.default.findOne({ email });
            if (!matchedOTPRecord) {
                throw Error("No otp records found.");
            }
            const { expiresAt } = matchedOTPRecord;
            //checking for expired code
            if (expiresAt < Date.now()) {
                yield OTP_model_1.default.deleteOne({ email });
                throw Error("Code has expired. Request for the new one");
            }
            // not expired yet, verify value
            const hashedOTP = matchedOTPRecord.otp;
            const validOTP = yield (0, helpers_1.verifyHashData)(otp, hashedOTP);
            return validOTP;
        }
        catch (e) {
            throw e;
        }
    });
    const { email, otp } = req.body;
    verifyOTP({ email, otp })
        .then((verified) => {
        if (verified) {
            res.json({ status: true, message: "OTP verified" });
        }
        else {
            res.json({ status: false, message: "OTP not verified verified" });
        }
    })
        .catch((e) => {
        res.json({ status: false, message: "error in verifying OTP" });
    });
}));
const deleteOTP = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield OTP_model_1.default.deleteOne({ email });
    }
    catch (e) {
        throw e;
    }
});
exports.default = router;
