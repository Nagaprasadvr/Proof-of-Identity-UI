import { Request, Response, response } from "express";
import {
  generateAsymmetricKeyPair,
  encryptData,
  decryptData,
} from "../controller/RSA";
import express from "express";
import os from "os";
import fs from "fs";
const router = express();

export interface KeyPair {
  pubKey: string;
  privateKey: string;
}

interface ArweaveData {
  passportUploadLink: string;
  aadharUploadLink: string;
  panUploadlink: string;
  picUploadLink: string;
}

interface UserSolData {
  name: string;
  contactNumber: string;
  dob: string;
  residenceAddress: string;
  panNumber: string;
  aadharNumber: string;
  passportId: string;
}

router.route("/keypairExistence").get((req: Request, res: Response) => {
  const homeDir = os.homedir();
  const path_512 = `${homeDir}/RSA/keypair_512.json`;
  const path_1028 = `${homeDir}/RSA/keypair_1028.json`;
  try {
    if (fs.existsSync(path_512) && fs.existsSync(path_1028)) {
      return res.json({ message: true });
    } else {
      return res.json({ message: false });
    }
  } catch (e) {
    return res.json({ message: "error" });
  }
});
router.route("/generateRSAKeyPair").get((req: Request, res: Response) => {
  const keyPair_512 = generateAsymmetricKeyPair(512);
  const keyPair_1028 = generateAsymmetricKeyPair(1028);
  const pubKey_512 = keyPair_512.publicKey;
  const privateKey_512 = keyPair_512.privateKey;
  const pubKey_1028 = keyPair_1028.publicKey;
  const privateKey_1028 = keyPair_1028.privateKey;
  const keyPairObj_512: KeyPair = {
    pubKey: pubKey_512,
    privateKey: privateKey_512,
  };
  const keyPairObj_1028: KeyPair = {
    pubKey: pubKey_1028,
    privateKey: privateKey_1028,
  };
  const jsonKeypairData_512 = JSON.stringify(keyPairObj_512);
  const jsonKeypairData_1028 = JSON.stringify(keyPairObj_1028);
  const homeDir = os.homedir();

  try {
    if (
      fs.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
      fs.existsSync(`${homeDir}/RSA/keypair_1028.json`)
    ) {
      return res.json({ message: "Keypair already exists" });
    } else {
      if (!fs.existsSync(`${homeDir}/RSA`)) {
        fs.mkdirSync(`${homeDir}/RSA`);
      }

      const savePath_512 = `${homeDir}/RSA/keypair_512.json`;
      const savePath_1028 = `${homeDir}/RSA/keypair_1028.json`;

      fs.writeFileSync(savePath_512, jsonKeypairData_512);
      fs.writeFileSync(savePath_1028, jsonKeypairData_1028);

      return res.json({ success: true, message: "Keypair Generation Success" });
    }
  } catch (e) {
    return res.json({ success: false, message: e });
  }
});

router.route("/encryptData").post((req: Request, res: Response) => {
  const homeDir = os.homedir();
  if (
    !(
      fs.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
      fs.existsSync(`${homeDir}/RSA/keypair_1028.json`)
    )
  ) {
    return res.json({ message: "Keypair doesn't exist" });
  }

  const ticker: "solData" | "arweaveData" = req.body.ticker;

  if (ticker === "solData") {
    const plainData = req.body.plainData as UserSolData;

    const keypairpath = `${homeDir}/RSA/keypair_512.json`;
    const keypair = fs.readFileSync(keypairpath);
    const keypairObj: KeyPair = JSON.parse(keypair.toString());
    const encryptedName = encryptData(plainData.name, keypairObj.pubKey);
    const encryptedContactNumber = encryptData(
      plainData.contactNumber,
      keypairObj.pubKey
    );
    const encryptedDob = encryptData(plainData.dob, keypairObj.pubKey);
    const encryptedAddress = encryptData(
      plainData.residenceAddress,
      keypairObj.pubKey
    );
    const encryptedPanNo = encryptData(plainData.panNumber, keypairObj.pubKey);
    const encryptedPassportID = encryptData(
      plainData.passportId,
      keypairObj.pubKey
    );
    const encryptedAadharNumber = encryptData(
      plainData.aadharNumber,
      keypairObj.pubKey
    );
    const encryptedUserData: UserSolData = {
      name: encryptedName,
      residenceAddress: encryptedAddress,
      contactNumber: encryptedContactNumber,
      panNumber: encryptedPanNo,
      aadharNumber: encryptedAadharNumber,
      passportId: encryptedPassportID,
      dob: encryptedDob,
    };

    return res.json({ encryptedData: encryptedUserData });
  } else if (ticker === "arweaveData") {
    const plainData = req.body.plainData as ArweaveData;
    const keypairpath = `${homeDir}/RSA/keypair_1028.json`;
    const keypair = fs.readFileSync(keypairpath);
    const keypairObj: KeyPair = JSON.parse(keypair.toString());
    const encryptedpicLink = encryptData(
      (plainData as ArweaveData).picUploadLink,
      keypairObj.pubKey
    );
    const encryptedaadharLink = encryptData(
      (plainData as ArweaveData).aadharUploadLink,
      keypairObj.pubKey
    );
    const encryptedpanLink = encryptData(
      (plainData as ArweaveData).panUploadlink,
      keypairObj.pubKey
    );
    const encryptedpassportLink = encryptData(
      (plainData as ArweaveData).passportUploadLink,
      keypairObj.pubKey
    );

    const encryptedArweaveData: ArweaveData = {
      panUploadlink: encryptedpanLink,
      picUploadLink: encryptedpicLink,
      passportUploadLink: encryptedpassportLink,
      aadharUploadLink: encryptedaadharLink,
    };
    return res.json({ encryptedData: encryptedArweaveData });
  }
});

router.route("/decryptData").post((req: Request, res: Response) => {
  const homeDir = os.homedir();
  if (
    !(
      fs.existsSync(`${homeDir}/RSA/keypair_512.json`) &&
      fs.existsSync(`${homeDir}/RSA/keypair_1028.json`)
    )
  ) {
    return res.json({ message: "Keypair doesn't exist" });
  }

  const ticker: "solData" | "arweaveData" = req.body.ticker;

  if (ticker === "solData") {
    const encData = req.body.encData as UserSolData;
    const keypairpath = `${homeDir}/RSA/keypair_512.json`;
    const keypair = fs.readFileSync(keypairpath);
    const keypairObj: KeyPair = JSON.parse(keypair.toString());
    const decryptedName = decryptData(encData.name, keypairObj.privateKey);
    const decryptedContactNumber = decryptData(
      encData.contactNumber,
      keypairObj.privateKey
    );
    const decryptedDob = decryptData(encData.dob, keypairObj.privateKey);
    const decryptedAddress = decryptData(
      encData.residenceAddress,
      keypairObj.privateKey
    );
    const decryptedPanNo = decryptData(
      encData.panNumber,
      keypairObj.privateKey
    );
    const decryptedPassportID = decryptData(
      encData.passportId,
      keypairObj.privateKey
    );
    const decryptedAadharNumber = decryptData(
      encData.aadharNumber,
      keypairObj.privateKey
    );
    const decryptedUserData: UserSolData = {
      name: decryptedName,
      residenceAddress: decryptedAddress,
      contactNumber: decryptedContactNumber,
      panNumber: decryptedPanNo,
      aadharNumber: decryptedAadharNumber,
      passportId: decryptedPassportID,
      dob: decryptedDob,
    };

    return res.json({ decryptedData: decryptedUserData });
  } else if (ticker === "arweaveData") {
    const encData = req.body.encData as ArweaveData;
    const keypairpath = `${homeDir}/RSA/keypair_1028.json`;
    const keypair = fs.readFileSync(keypairpath);
    const keypairObj: KeyPair = JSON.parse(keypair.toString());
    const decryptedpicLink = encryptData(
      (encData as ArweaveData).picUploadLink,
      keypairObj.privateKey
    );
    const decryptedaadharLink = encryptData(
      (encData as ArweaveData).aadharUploadLink,
      keypairObj.privateKey
    );
    const decryptedpanLink = encryptData(
      (encData as ArweaveData).panUploadlink,
      keypairObj.privateKey
    );
    const decryptedpassportLink = encryptData(
      (encData as ArweaveData).passportUploadLink,
      keypairObj.privateKey
    );

    const decryptedArweaveData: ArweaveData = {
      panUploadlink: decryptedpanLink,
      picUploadLink: decryptedpicLink,
      passportUploadLink: decryptedpassportLink,
      aadharUploadLink: decryptedaadharLink,
    };
    return res.json({ decryptedData: decryptedArweaveData });
  }
});

router.route("/getRSAKeypair").get((req: Request, res: Response) => {
  const homeDir = os.homedir();
  const keypair_512_path = `${homeDir}/RSA/keypair_512.json`;
  const keypair_1028_path = `${homeDir}/RSA/keypair_1028.json`;
  if (fs.existsSync(keypair_512_path) && fs.existsSync(keypair_1028_path)) {
    const keypair_512 = fs.readFileSync(keypair_512_path);
    const keypair_1028 = fs.readFileSync(keypair_1028_path);
    const keypair_512_Obj: KeyPair = JSON.parse(keypair_512.toString());
    const keyPair_1028_Obj: KeyPair = JSON.parse(keypair_1028.toString());

    return res.json({
      status: true,
      keypair_512: keypair_512_Obj,
      keypair_1028: keyPair_1028_Obj,
    });
  } else {
    return res.json({ status: false, message: "Keypair doesnt exist" });
  }
});

export default router;
