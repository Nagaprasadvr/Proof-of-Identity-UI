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
exports.verifyHashData = exports.hashData = exports.generateOTP = exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { AUTH_EMAIL, AUTH_PASS } = process.env;
let transporter = nodemailer_1.default.createTransport({
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
    }
    else {
        console.log("Ready for message");
    }
});
const sendEmail = (mailOptions) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transporter.sendMail(mailOptions);
        return;
    }
    catch (e) {
        throw e;
    }
});
exports.sendEmail = sendEmail;
const generateOTP = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        return otp;
    }
    catch (e) {
        throw e;
    }
});
exports.generateOTP = generateOTP;
const bcrypt_1 = __importDefault(require("bcrypt"));
const hashData = (data, saltRounds = 10) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedData = yield bcrypt_1.default.hash(data, saltRounds);
        return hashedData;
    }
    catch (e) {
        throw e;
    }
});
exports.hashData = hashData;
const verifyHashData = (unhashed, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const match = yield bcrypt_1.default.compare(unhashed, hashed);
        return match;
    }
    catch (e) {
        throw e;
    }
});
exports.verifyHashData = verifyHashData;
