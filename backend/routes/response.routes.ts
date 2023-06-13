import { Request,Response } from "express";
import SendRequest from "../models/SendIdentityRequest.model";
import express from "express"
const router = express();

router.route("/:id").delete((req: Request, res: Response) => {
    const id = req.params.id;
    SendRequest.findByIdAndDelete(id)
        .then((response: any) => res.send("the data successfully denied"))
        .catch((err: any) => console.log(err));
})

router.route("/").get((req: Request, res: Response) => {
  return res.send("hello")
});

export default  router;