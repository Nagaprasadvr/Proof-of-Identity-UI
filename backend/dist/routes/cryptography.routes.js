"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
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
    if (
      fs_1.default.existsSync(path_512) &&
      fs_1.default.existsSync(path_1028)
    ) {
      return res.json({ message: true });
    } else {
      return res.json({ message: false });
    }
  } catch (e) {
    res.json({ message: "error" });
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
    if (
      fs_1.default.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
      fs_1.default.existsSync(`${homeDir}/RSA/keypair_1028.json`)
    ) {
      return res.json({ message: "Keypair already exists" });
    } else {
      if (!fs_1.default.existsSync(`${homeDir}/RSA`)) {
        fs_1.default.mkdirSync(`${homeDir}/RSA`);
      }
      const savePath_512 = `${homeDir}/RSA/keypair_512.json`;
      const savePath_1028 = `${homeDir}/RSA/keypair_1028.json`;
      fs_1.default.writeFileSync(savePath_512, jsonKeypairData_512);
      fs_1.default.writeFileSync(savePath_1028, jsonKeypairData_1028);
      return res.json({ success: true, message: "Keypair Generation Success" });
    }
  } catch (e) {
    return res.json({ success: false, message: e });
  }
});
router.route("/encryptData").post((req, res) => {
  const homeDir = os_1.default.homedir();
  if (
    !(
      fs_1.default.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
      fs_1.default.existsSync(`${homeDir}/RSA/keypair_1028.json`)
    )
  ) {
    return res.json({ message: "Keypair doesn't exist" });
  }
  const ticker = req.body.ticker;
  if (ticker === "solData") {
    const plainData = req.body.plainData;
    const keypairpath = `${homeDir}/RSA/keypair_512.json`;
    const keypair = fs_1.default.readFileSync(keypairpath);
    const keypairObj = JSON.parse(keypair.toString());
    const encryptedName = (0, RSA_1.encryptData)(
      plainData.name,
      keypairObj.pubKey
    );
    const encryptedContactNumber = (0, RSA_1.encryptData)(
      plainData.contactNumber,
      keypairObj.pubKey
    );
    const encryptedDob = (0, RSA_1.encryptData)(
      plainData.dob,
      keypairObj.pubKey
    );
    const encryptedAddress = (0, RSA_1.encryptData)(
      plainData.residenceAddress,
      keypairObj.pubKey
    );
    const encryptedPanNo = (0, RSA_1.encryptData)(
      plainData.panNumber,
      keypairObj.pubKey
    );
    const encryptedPassportID = (0, RSA_1.encryptData)(
      plainData.passportId,
      keypairObj.pubKey
    );
    const encryptedAadharNumber = (0, RSA_1.encryptData)(
      plainData.aadharNumber,
      keypairObj.pubKey
    );
    const encryptedUserData = {
      name: encryptedName,
      residenceAddress: encryptedAddress,
      contactNumber: encryptedContactNumber,
      panNumber: encryptedPanNo,
      aadharNumber: encryptedAadharNumber,
      passportId: encryptedPassportID,
      dob: encryptedDob,
    };
    res.json({ encryptData: encryptedUserData });
    res.json({ encryptedData: RSA_1.encryptData });
  } else if (ticker === "arweaveData") {
    const plainData = req.body.plainData;
    const keypairpath = `${homeDir}/RSA/keypair_1028.json`;
    const keypair = fs_1.default.readFileSync(keypairpath);
    const keypairObj = JSON.parse(keypair.toString());
    const encryptedpicLink = (0, RSA_1.encryptData)(
      plainData.picUploadLink,
      keypairObj.pubKey
    );
    const encryptedaadharLink = (0, RSA_1.encryptData)(
      plainData.aadharUploadLink,
      keypairObj.pubKey
    );
    const encryptedpanLink = (0, RSA_1.encryptData)(
      plainData.panUploadlink,
      keypairObj.pubKey
    );
    const encryptedpassportLink = (0, RSA_1.encryptData)(
      plainData.passportUploadLink,
      keypairObj.pubKey
    );
    const encryptedArweaveData = {
      panUploadlink: encryptedpanLink,
      picUploadLink: encryptedpicLink,
      passportUploadLink: encryptedpassportLink,
      aadharUploadLink: encryptedaadharLink,
    };
    res.json({ encryptedData: encryptedArweaveData });
  }
});
exports.default = router;
