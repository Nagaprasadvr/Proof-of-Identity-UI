"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RSA_1 = require("../controller/RSA");
const express_1 = __importDefault(require("express"));
const router = (0, express_1.default)();
router.route("/generateRSAKeyPair").get((req, res) => {
    const keyPair = (0, RSA_1.generateAsymmetricKeyPair)();
    const pubKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;
    const keyPairObj = {
        pubKey,
        privateKey
    };
    const jsonKeypairData = JSON.stringify(keyPairObj);
    // fs.writeFileSync('')
    return res.json({ message: "Keypair Generation Success" });
});
