import express,{Express,Request,Response, response} from "express";
import mongoose from "mongoose";
import os from 'os'
import cors from 'cors';
import digitalIdentities from "./routes/digitalIdentities.routes";
import cryptography from "./routes/cryptography.routes"
import dotenv from 'dotenv';
import fs from 'fs'
import { decryptData, encryptData, generateAsymmetricKeyPair } from "./controller/RSA";
import request from "./routes/requests.routes";
import responsePage from "./routes/response.routes";

dotenv.config()
const app:Express = express();
const port = 9000;
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors())
const URI = process.env.MONGODB_URL as string;
mongoose.connect(
  URI,
  {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
  }
);
// Routes
app.get('/Allusers', (req: Request, res: Response) => {
})

app.get("/", (req:Request, res:Response) => {
  res.send("Hello, World!");
});
app.use("/digitalIdentities", digitalIdentities);

app.use("/cryptography", cryptography)

app.use("/requests", request);

app.use("/response", responsePage)


// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




