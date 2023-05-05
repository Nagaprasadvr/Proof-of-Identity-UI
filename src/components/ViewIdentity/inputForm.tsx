import React, { useState } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as sdk from "../../digitalIdentity/js/src/generated/"
import { useWallet } from "@solana/wallet-adapter-react";
import * as Buffer from "buffer"
export const InputPubkey = () => {
  const [pubkey, setPubkey] = useState<string>("")
  const wallet = useWallet();
  // typing on RIGHT hand side of =
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPubkey(e.currentTarget.value);


  };
  const onSubmit = async () => {
    console.log(pubkey);
    const conn = new Connection("http://127.0.0.1:8899");
    const publickey = new PublicKey(pubkey as string);
    const newP = new PublicKey("6DJX6MS53NdUCUM5pwUMNvSxssgLBCUGL7n9GwjAWSKb")
    const auth = new PublicKey("Cwrg5APrLUcVyjCfZ8YjzpdmxH16PuLrxSNhfyeoLnkr")
    const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync([Buffer.Buffer.from("dig_identity"), auth.toBuffer()], sdk.PROGRAM_ID)
    const acc = await sdk.DigitalIdentity.fromAccountAddress(conn, newP);
    console.log("acc:", acc)
    const tx = new Transaction();
    const ix = sdk.createVerifyIdentityInstruction({ digIdentityAcc: newP, authority: auth }, sdk.PROGRAM_ID);
    console.log("program id:", sdk.PROGRAM_ID.toBase58())
    tx.instructions.push(ix);

    tx.feePayer = wallet?.publicKey as PublicKey;
    tx.recentBlockhash = (await conn.getRecentBlockhash()).blockhash

    const txHash = await wallet.sendTransaction(tx, conn);
    console.log(`https://explorer.solana.com/address/${txHash}`)



  }

  return (
    <div>
      <label style={{ color: "lightskyblue", fontSize: "30px", fontWeight: "bolder" }}>
        Enter your solana Pubkey associated with the digital Identity
      </label>
      <div style={{ marginTop: "20px" }} className="w3-animate-bottom" >
        <input type="text" style={{ color: "black", height: "50px", width: "600px", borderRadius: "0.5em", fontSize: "20px" }} placeholder="enter pubkey" onChange={onChange} suppressHydrationWarning={true} suppressContentEditableWarning={true}>
        </input>
      </div>
      <div className=" App w3-animate-bottom" style={{ marginTop: '20px', alignContent: 'center', }}>
        <button style={{ width: "100px" }} className="balance-button w3-btn w3-hover-white App " onClick={onSubmit}>
          submit
        </button>
      </div>
    </div>
  );

}
