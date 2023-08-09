"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decryptData = exports.encryptData = exports.generateAsymmetricKeyPair = void 0;
const crypto_1 = __importDefault(require("crypto"));
// Generate an asymmetric key pair
const generateAsymmetricKeyPair = (modulus) => {
    return crypto_1.default.generateKeyPairSync('rsa', {
        modulusLength: modulus,
        publicKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs1',
            format: 'pem',
        },
    });
};
exports.generateAsymmetricKeyPair = generateAsymmetricKeyPair;
// Encrypt data using the public key
const encryptData = (data, publicKey) => {
    const encryptedBuffer = crypto_1.default.publicEncrypt(publicKey, Buffer.from(data));
    return encryptedBuffer.toString('base64');
};
exports.encryptData = encryptData;
// Decrypt data using the private key
const decryptData = (encryptedData, privateKey) => {
    const decryptedBuffer = crypto_1.default.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'));
    return decryptedBuffer.toString('utf8');
};
exports.decryptData = decryptData;
