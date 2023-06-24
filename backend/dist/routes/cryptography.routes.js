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
    const path_512 = `${homeDir}/RSA/keypair_512.json`;
    const path_1028 = `${homeDir}/RSA/keypair_1028.json`;
    try {
        if (fs_1.default.existsSync(path_512) && fs_1.default.existsSync(path_1028)) {
            return res.json({ message: true });
        }
        else {
            return res.json({ message: false });
        }
    }
    catch (e) {
        return res.json({ message: "error" });
    }
});
router.route("/generateRSAKeyPair").get((req, res) => {
    const keyPair_512 = (0, RSA_1.generateAsymmetricKeyPair)(512);
    const keyPair_1028 = (0, RSA_1.generateAsymmetricKeyPair)(1028);
    const pubKey_512 = keyPair_512.publicKey;
    const privateKey_512 = keyPair_512.privateKey;
    const pubKey_1028 = keyPair_1028.publicKey;
    const privateKey_1028 = keyPair_1028.privateKey;
    const keyPairObj_512 = {
        pubKey: pubKey_512,
        privateKey: privateKey_512,
    };
    const keyPairObj_1028 = {
        pubKey: pubKey_1028,
        privateKey: privateKey_1028,
    };
    const jsonKeypairData_512 = JSON.stringify(keyPairObj_512);
    const jsonKeypairData_1028 = JSON.stringify(keyPairObj_1028);
    const homeDir = os_1.default.homedir();
    try {
        if (fs_1.default.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
            fs_1.default.existsSync(`${homeDir}/RSA/keypair_1028.json`)) {
            return res.json({ message: "Keypair already exists" });
        }
        else {
            if (!fs_1.default.existsSync(`${homeDir}/RSA`)) {
                fs_1.default.mkdirSync(`${homeDir}/RSA`);
            }
            const savePath_512 = `${homeDir}/RSA/keypair_512.json`;
            const savePath_1028 = `${homeDir}/RSA/keypair_1028.json`;
            fs_1.default.writeFileSync(savePath_512, jsonKeypairData_512);
            fs_1.default.writeFileSync(savePath_1028, jsonKeypairData_1028);
            return res.json({ success: true, message: "Keypair Generation Success" });
        }
    }
    catch (e) {
        return res.json({ success: false, message: e });
    }
});
router.route("/encryptData").post((req, res) => {
    const homeDir = os_1.default.homedir();
    if (!(fs_1.default.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
        fs_1.default.existsSync(`${homeDir}/RSA/keypair_1028.json`))) {
        return res.json({ message: "Keypair doesn't exist" });
    }
    const ticker = req.body.ticker;
    if (ticker === "solData") {
        const plainData = req.body.plainData;
        const keypairpath = `${homeDir}/RSA/keypair_512.json`;
        const keypair = fs_1.default.readFileSync(keypairpath);
        const keypairObj = JSON.parse(keypair.toString());
        const encryptedName = (0, RSA_1.encryptData)(plainData.name, keypairObj.pubKey);
        const encryptedContactNumber = (0, RSA_1.encryptData)(plainData.contactNumber, keypairObj.pubKey);
        const encryptedDob = (0, RSA_1.encryptData)(plainData.dob, keypairObj.pubKey);
        const encryptedAddress = (0, RSA_1.encryptData)(plainData.residenceAddress, keypairObj.pubKey);
        const encryptedPanNo = (0, RSA_1.encryptData)(plainData.panNumber, keypairObj.pubKey);
        const encryptedPassportID = (0, RSA_1.encryptData)(plainData.passportId, keypairObj.pubKey);
        const encryptedAadharNumber = (0, RSA_1.encryptData)(plainData.aadharNumber, keypairObj.pubKey);
        const encryptedUserData = {
            name: encryptedName,
            residenceAddress: encryptedAddress,
            contactNumber: encryptedContactNumber,
            panNumber: encryptedPanNo,
            aadharNumber: encryptedAadharNumber,
            passportId: encryptedPassportID,
            dob: encryptedDob,
        };
        return res.json({ encryptedData: encryptedUserData });
    }
    else if (ticker === "arweaveData") {
        const plainData = req.body.plainData;
        const keypairpath = `${homeDir}/RSA/keypair_1028.json`;
        const keypair = fs_1.default.readFileSync(keypairpath);
        const keypairObj = JSON.parse(keypair.toString());
        const encryptedpicLink = (0, RSA_1.encryptData)(plainData.picUploadLink, keypairObj.pubKey);
        const encryptedaadharLink = (0, RSA_1.encryptData)(plainData.aadharUploadLink, keypairObj.pubKey);
        const encryptedpanLink = (0, RSA_1.encryptData)(plainData.panUploadLink, keypairObj.pubKey);
        const encryptedpassportLink = (0, RSA_1.encryptData)(plainData.passportUploadLink, keypairObj.pubKey);
        const encryptedArweaveData = {
            panUploadLink: encryptedpanLink,
            picUploadLink: encryptedpicLink,
            passportUploadLink: encryptedpassportLink,
            aadharUploadLink: encryptedaadharLink,
        };
        return res.json({ encryptedData: encryptedArweaveData });
    }
});
router.route("/encryptDataWithPubkey").post((req, res) => {
    const homeDir = os_1.default.homedir();
    const ticker = req.body.ticker;
    if (ticker === "solData") {
        const plainData = req.body.plainData;
        const pubkey = req.body.pubkey;
        const encryptedName = (0, RSA_1.encryptData)(plainData.name, pubkey);
        const encryptedContactNumber = (0, RSA_1.encryptData)(plainData.contactNumber, pubkey);
        const encryptedDob = (0, RSA_1.encryptData)(plainData.dob, pubkey);
        const encryptedAddress = (0, RSA_1.encryptData)(plainData.residenceAddress, pubkey);
        const encryptedPanNo = (0, RSA_1.encryptData)(plainData.panNumber, pubkey);
        const encryptedPassportID = (0, RSA_1.encryptData)(plainData.passportId, pubkey);
        const encryptedAadharNumber = (0, RSA_1.encryptData)(plainData.aadharNumber, pubkey);
        const encryptedUserData = {
            name: encryptedName,
            residenceAddress: encryptedAddress,
            contactNumber: encryptedContactNumber,
            panNumber: encryptedPanNo,
            aadharNumber: encryptedAadharNumber,
            passportId: encryptedPassportID,
            dob: encryptedDob,
        };
        return res.json({ encryptedData: encryptedUserData });
    }
    else if (ticker === "arweaveData") {
        const plainData = req.body.plainData;
        const pubKey = req.body.pubkey;
        const encryptedpicLink = (0, RSA_1.encryptData)(plainData.picUploadLink, pubKey);
        const encryptedaadharLink = (0, RSA_1.encryptData)(plainData.aadharUploadLink, pubKey);
        const encryptedpanLink = (0, RSA_1.encryptData)(plainData.panUploadLink, pubKey);
        const encryptedpassportLink = (0, RSA_1.encryptData)(plainData.passportUploadLink, pubKey);
        const encryptedArweaveData = {
            panUploadLink: encryptedpanLink,
            picUploadLink: encryptedpicLink,
            passportUploadLink: encryptedpassportLink,
            aadharUploadLink: encryptedaadharLink,
        };
        return res.json({ encryptedData: encryptedArweaveData });
    }
});
router.route("/decryptData").post((req, res) => {
    const homeDir = os_1.default.homedir();
    if (!(fs_1.default.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
        fs_1.default.existsSync(`${homeDir}/RSA/keypair_1028.json`))) {
        return res.json({ message: "Keypair doesn't exist" });
    }
    console.log("req body", req.body);
    const ticker = req.body.ticker;
    if (ticker === "solData") {
        const encData = req.body.encData;
        const keypairpath = `${homeDir}/RSA/keypair_512.json`;
        const keypair = fs_1.default.readFileSync(keypairpath);
        const keypairObj = JSON.parse(keypair.toString());
        const decryptedName = (0, RSA_1.decryptData)(encData.name, keypairObj.privateKey);
        console.log("decrypted name", decryptedName);
        const decryptedContactNumber = (0, RSA_1.decryptData)(encData.contactNumber, keypairObj.privateKey);
        console.log("decrypted contact number", decryptedContactNumber);
        const decryptedDob = (0, RSA_1.decryptData)(encData.dob, keypairObj.privateKey);
        console.log("decrypted dob", decryptedDob);
        console.log("residence address", encData.residenceAddress);
        const decryptedAddress = (0, RSA_1.decryptData)(encData.residenceAddress, keypairObj.privateKey);
        console.log("decrypted address", decryptedAddress);
        const decryptedPanNo = (0, RSA_1.decryptData)(encData.panNumber, keypairObj.privateKey);
        console.log("decrypted pan no", decryptedPanNo);
        const decryptedPassportID = (0, RSA_1.decryptData)(encData.passportId, keypairObj.privateKey);
        console.log("decrypted passport id", decryptedPassportID);
        const decryptedAadharNumber = (0, RSA_1.decryptData)(encData.aadharNumber, keypairObj.privateKey);
        console.log("decrypted aadhar number", decryptedAadharNumber);
        const decryptedUserData = {
            name: decryptedName,
            residenceAddress: decryptedAddress,
            contactNumber: decryptedContactNumber,
            panNumber: decryptedPanNo,
            aadharNumber: decryptedAadharNumber,
            passportId: decryptedPassportID,
            dob: decryptedDob,
        };
        return res.json({ decryptedData: decryptedUserData });
    }
    else if (ticker === "arweaveData") {
        const encData = req.body.encData;
        const keypairpath = `${homeDir}/RSA/keypair_1028.json`;
        const keypair = fs_1.default.readFileSync(keypairpath);
        const keypairObj = JSON.parse(keypair.toString());
        const decryptedpicLink = (0, RSA_1.decryptData)(encData.picUploadLink, keypairObj.privateKey);
        const decryptedaadharLink = (0, RSA_1.decryptData)(encData.aadharUploadLink, keypairObj.privateKey);
        const decryptedpanLink = (0, RSA_1.decryptData)(encData.panUploadLink, keypairObj.privateKey);
        const decryptedpassportLink = (0, RSA_1.decryptData)(encData.passportUploadLink, keypairObj.privateKey);
        const decryptedArweaveData = {
            panUploadLink: decryptedpanLink,
            picUploadLink: decryptedpicLink,
            passportUploadLink: decryptedpassportLink,
            aadharUploadLink: decryptedaadharLink,
        };
        return res.json({ decryptedData: decryptedArweaveData });
    }
});
router.route("/getRSAKeypair").get((req, res) => {
    const homeDir = os_1.default.homedir();
    const keypair_512_path = `${homeDir}/RSA/keypair_512.json`;
    const keypair_1028_path = `${homeDir}/RSA/keypair_1028.json`;
    if (fs_1.default.existsSync(keypair_512_path) && fs_1.default.existsSync(keypair_1028_path)) {
        const keypair_512 = fs_1.default.readFileSync(keypair_512_path);
        const keypair_1028 = fs_1.default.readFileSync(keypair_1028_path);
        const keypair_512_Obj = JSON.parse(keypair_512.toString());
        const keyPair_1028_Obj = JSON.parse(keypair_1028.toString());
        return res.json({
            status: true,
            keypair_512: keypair_512_Obj,
            keypair_1028: keyPair_1028_Obj,
        });
    }
    else {
        return res.json({ status: false, message: "Keypair doesnt exist" });
    }
});
exports.default = router;
