"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RSA_1 = require("../controller/RSA");
const express_1 = __importDefault(require("express"));
const os_1 = __importDefault(require("os"));
const fs_1 = __importDefault(require("fs"));
const router = (0, express_1.default)();
router.route("/keypairExistence").get((req, res) => {
    const homeDir = os_1.default.homedir();
    const path = `${homeDir}/RSA/keypair.json`;
    try {
        if (fs_1.default.existsSync(path)) {
            console.log("exists");
            return res.json({ message: true });
        }
        else {
            return res.json({ message: false });
        }
    }
    catch (e) {
        res.json({ message: "error" });
    }
});
router.route("/generateRSAKeyPair").get((req, res) => {
    const keyPair = (0, RSA_1.generateAsymmetricKeyPair)();
    const pubKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;
    const keyPairObj = {
        pubKey,
        privateKey
    };
    const jsonKeypairData = JSON.stringify(keyPairObj);
    const homeDir = os_1.default.homedir();
    try {
        if (fs_1.default.existsSync(`${homeDir}/RSA/keypair.json`)) {
            return res.json({ message: "Keypair already exists" });
        }
        else {
            if (!fs_1.default.existsSync(`${homeDir}/RSA`)) {
                fs_1.default.mkdirSync(`${homeDir}/RSA`);
            }
            const savePath = `${homeDir}/RSA/keypair.json`;
            fs_1.default.writeFileSync(savePath, jsonKeypairData);
            return res.json({ success: true, message: "Keypair Generation Success" });
        }
    }
    catch (e) {
        return res.json({ success: false, message: e });
    }
});
exports.default = router;
