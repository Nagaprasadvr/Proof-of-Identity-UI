import { Request,Response } from "express";
import { generateAsymmetricKeyPair,encryptData,decryptData } from "../controller/RSA";
import express from "express"
import os from 'os'
import fs from "fs"
const router = express();


interface KeyPair {
    pubKey:string;
    privateKey:string
}
router.route("/generateRSAKeyPair").get((req:Request,res:Response)=>{
    const keyPair = generateAsymmetricKeyPair();
    const pubKey = keyPair.publicKey;
    const privateKey = keyPair.privateKey;
    const keyPairObj:KeyPair = {
        pubKey,
        privateKey
    }
    const jsonKeypairData = JSON.stringify(keyPairObj);
    const homeDir = os.homedir();
    try{
        if(fs.existsSync(`${homeDir}/RSA/keypair.json`))
        {
            return res.json({ message:"Keypair already exists"})
        }
        else {
            if(!fs.existsSync(`${homeDir}/RSA`))
            {
                fs.mkdirSync(`${homeDir}/RSA`)
            }
            
            const savePath = `${homeDir}/RSA/keypair.json`;
    
            fs.writeFileSync(savePath,jsonKeypairData)
            return res.json({success:true, message:"Keypair Generation Success"})
        }
        
    }
    catch(e){
        return res.json({success:false,message:e})

    }
  
})

export default router;