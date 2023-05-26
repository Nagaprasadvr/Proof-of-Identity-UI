import { Request,Response } from "express";
import DigIds from "../models/DigitalIdentities.model";
import express from "express"
const router = express();

router.route("/get").get((req:Request, res:Response ) => {
  DigIds.find()
    .then((digIds:any) => res.json(digIds))
    .catch((err:any) => res.status(400).json("Error:"+err));
});

router.route("/add").post((req, res) => {
  const userPubkey = req.body.userPubkey;
  const digitalIdentityPubkey = req.body.digitalIdentityPubkey;
  const newdigId = new DigIds({
    userPubkey: userPubkey,
    digitalIdentityPubkey: digitalIdentityPubkey,
  });
  newdigId
    .save()
    .then(() => {
      res.json("Digital Identity Added!");
    })
    .catch((err) => res.json("Error:"+ err));
});
export default  router;
