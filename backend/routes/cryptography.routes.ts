import { Request,Response, response } from "express";
import { generateAsymmetricKeyPair,encryptData,decryptData } from "../controller/RSA";
import express from "express"
import os from 'os'
import fs from "fs"
const router = express();

interface KeyPair {
    pubKey:string;
    privateKey:string
}

interface ArweaveData {
    passportUploadLink:string;
    aadharUploadLink:string;
    panUploadlink:string;
    picUploadLink:string;
}

interface UserSolData {
    name: string,
    contactNumber: string,
    dob: string,
    residenceAddress: string,
    panNumber: string,
    aadharNumber: string,
    passportId: string,
}

router.route("/keypairExistence").get((req:Request,res:Response)=>{
    const homeDir = os.homedir();
    const path_512 = `${homeDir}/RSA/keypair_512.json`
    const path_1028 = `${homeDir}/RSA/keypair_1028.json`
    try{
        if(fs.existsSync(path_512) && fs.existsSync(path_1028))
        {
          
            return res.json({message:true})
        }
        else{
            return res.json({message:false})
        }
    }
    catch(e)
    {
        res.json({message:"error"})
    }

})
router.route("/generateRSAKeyPair").get((req:Request,res:Response)=>{
    const keyPair_512 = generateAsymmetricKeyPair(512);
    const keyPair_1028 = generateAsymmetricKeyPair(1028);
    const pubKey_512 = keyPair_512.publicKey;
    const privateKey_512 = keyPair_512.privateKey;
    const pubKey_1028 = keyPair_1028.publicKey;
    const privateKey_1028= keyPair_1028.privateKey;
    const keyPairObj_512:KeyPair = {
        pubKey:pubKey_512,
        privateKey:privateKey_512
    }
    const keyPairObj_1028:KeyPair = {
        pubKey:pubKey_1028,
        privateKey:privateKey_1028
    }
    const jsonKeypairData_512 = JSON.stringify(keyPairObj_512);
    const jsonKeypairData_1028 = JSON.stringify(keyPairObj_1028);
    const homeDir = os.homedir();

    try{
        if(fs.existsSync(`${homeDir}/RSA/keypair_512.json`) && fs.existsSync(`${homeDir}/RSA/keypair_1028.json`) )
        {
            return res.json({ message:"Keypair already exists"})
        }
        else {
            if(!fs.existsSync(`${homeDir}/RSA`))
            {
                fs.mkdirSync(`${homeDir}/RSA`)
            }
            
            const savePath_512 = `${homeDir}/RSA/keypair_512.json`;
            const savePath_1028 = `${homeDir}/RSA/keypair_1028.json`;
    
            fs.writeFileSync(savePath_512,jsonKeypairData_512)
            fs.writeFileSync(savePath_1028,jsonKeypairData_1028)

            return res.json({success:true, message:"Keypair Generation Success"})
        }
        
    }
    catch(e){
        return res.json({success:false,message:e})

    }
  
})

router.route("/encryptData").post((req:Request,res:Response)=>{
    const homeDir = os.homedir();
    if(!(fs.existsSync(`${homeDir}/RSA/keypair_512.json`) && fs.existsSync(`${homeDir}/RSA/keypair_1028.json`)) )
        {
            return res.json({ message:"Keypair doesn't exist"})
        }

    const ticker:"solData" | "arweaveData" = req.body.ticker;
    
    if(ticker === "solData")
    {
        const plainData = req.body.plainData as UserSolData;
        const keypairpath = `${homeDir}/RSA/keypair_512.json`
        const keypair = fs.readFileSync(keypairpath);
        const keypairObj:KeyPair = JSON.parse(keypair.toString())
        const encryptedName = encryptData(plainData.name,keypairObj.pubKey);
        const encryptedContactNumber = encryptData(plainData.contactNumber,keypairObj.pubKey);
        const encryptedDob = encryptData(plainData.dob,keypairObj.pubKey);
        const encryptedAddress = encryptData(plainData.residenceAddress,keypairObj.pubKey);
        const encryptedPanNo = encryptData(plainData.panNumber,keypairObj.pubKey);
        const encryptedPassportID = encryptData(plainData.passportId,keypairObj.pubKey);
        const encryptedAadharNumber = encryptData(plainData.aadharNumber,keypairObj.pubKey);
        const encryptedUserData:UserSolData = {
            name:encryptedName,
            residenceAddress:encryptedAddress,
            contactNumber:encryptedContactNumber,
            panNumber:encryptedPanNo,
            aadharNumber:encryptedAadharNumber,
            passportId:encryptedPassportID,
            dob:encryptedDob
        }
        res.json({encryptData:encryptedUserData})




        res.json({encryptedData:encryptData})
    }
    else if(ticker === "arweaveData")
    {
        const plainData = req.body.plainData as ArweaveData;
        const keypairpath = `${homeDir}/RSA/keypair_1028.json`
        const keypair = fs.readFileSync(keypairpath);
        const keypairObj:KeyPair = JSON.parse(keypair.toString())
        const encryptedpicLink = encryptData((plainData as ArweaveData).picUploadLink,keypairObj.pubKey);
        const encryptedaadharLink = encryptData((plainData as ArweaveData).aadharUploadLink,keypairObj.pubKey);
        const encryptedpanLink = encryptData((plainData as ArweaveData).panUploadlink,keypairObj.pubKey);
        const encryptedpassportLink = encryptData((plainData as ArweaveData).passportUploadLink,keypairObj.pubKey);
        
        const encryptedArweaveData :ArweaveData = {
            panUploadlink:encryptedpanLink,
            picUploadLink:encryptedpicLink,
            passportUploadLink:encryptedpassportLink,
            aadharUploadLink:encryptedaadharLink
            
        }
        res.json({encryptedData:encryptedArweaveData})
    }



})

export default router;