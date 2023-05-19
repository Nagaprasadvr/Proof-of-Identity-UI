import React, { useEffect, useState } from "react";
import { Connection, PublicKey, Transaction } from "@solana/web3.js";
import * as sdk from "../../digitalIdentity/js/src/generated/"
import { useWallet } from "@solana/wallet-adapter-react";
import * as Buffer from "buffer"
import { Box } from '@mui/material';
import * as solana from "@solana/web3.js"
import toast from "react-hot-toast"
import ViewIdentityModal from "./ViewIdentityModal";
export const InputPubkey = () => {
  const [open, setOpen] = useState<boolean>(false)
  const [digIdentityAcc, setDigIdentityAcc] = useState<sdk.DigitalIdentity | null>(null);
  const [digitalIdentityPda, setDigIdentityPda] = useState<string>("")
  const [pubkey, setPubkey] = useState<string>("")
  const wallet = useWallet();


  useEffect(() => {
    if (wallet?.publicKey) {
      console.log("firing")
      setDigIdentityAcc(null)
    }

  }, [wallet?.publicKey])
  // typing on RIGHT hand side of =
  const onChange = (e: React.FormEvent<HTMLInputElement>) => {
    setPubkey(e.currentTarget.value);

  };

  const handleClose = () => {
    setOpen(!open)

  }
  const onSubmit = async () => {
    const id = toast.loading("fetching Digital Identity")

    if (digIdentityAcc) {
      setTimeout(() => {
        toast.dismiss(id);
        setOpen(!open)
        return
      }, 2000)

    }
    else {

      try {

        if (wallet?.publicKey) {

          console.log(pubkey);
          // const conn = new Connection("http://127.0.0.1:8899");
          const rpcConn = new Connection(solana.clusterApiUrl("devnet"))
          const publickey = new PublicKey(pubkey as string);
          // const newP = new PublicKey("6DJX6MS53NdUCUM5pwUMNvSxssgLBCUGL7n9GwjAWSKb")
          // const auth = new PublicKey("Cwrg5APrLUcVyjCfZ8YjzpdmxH16PuLrxSNhfyeoLnkr")
          const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync([Buffer.Buffer.from("dig_identity"), wallet?.publicKey.toBuffer()], sdk.PROGRAM_ID)
          const acc = await sdk.DigitalIdentity.fromAccountAddress(rpcConn, digitalPdaAcc);
          console.log("acc:", acc)
          // const tx = new Transaction();
          // const ix = sdk.createVerifyIdentityInstruction({ digIdentityAcc: newP, authority: auth }, sdk.PROGRAM_ID);
          // console.log("program id:", sdk.PROGRAM_ID.toBase58())
          // tx.instructions.push(ix);

          // tx.feePayer = wallet?.publicKey as PublicKey;
          // tx.recentBlockhash = (await rpcConn.getRecentBlockhash()).blockhash

          // const txHash = await wallet.sendTransaction(tx, rpcConn);
          // console.log(`https://explorer.solana.com/address/${txHash}`)
          toast.dismiss(id);
          setDigIdentityAcc(acc)
          setDigIdentityPda(digitalPdaAcc.toBase58())
          setOpen(!open)

        }

      }
      catch (e) {
        console.error(e)
        toast.dismiss(id)
        toast.error("Error in fetching Digital Identity Account , maybe its not created")

      }

    }

  }

  return (
    <Box>
      <label style={{ color: "lightskyblue", fontSize: "30px", fontWeight: "bolder" }}>
        Enter your solana Pubkey associated with the digital Identity
      </label>
      <Box style={{ marginTop: "20px", display: "flex", justifyContent: "center" }} className="w3-animate-bottom" >
        <input type="text" style={{ color: "black", height: "50px", width: "600px", borderRadius: "0.5em", fontSize: "20px" }} placeholder="enter pubkey" onChange={onChange} suppressHydrationWarning={true} suppressContentEditableWarning={true}>
        </input>
      </Box>
      <Box className=" App w3-animate-bottom" style={{ marginTop: '20px', alignContent: 'center', }}>
        <button style={{ width: "100px" }} className="balance-button w3-btn w3-hover-white App " onClick={onSubmit}>
          submit
        </button>
      </Box>
      {open && digIdentityAcc && (<ViewIdentityModal open={open} data={digIdentityAcc} digitalIdentityPda={digitalIdentityPda} handleClose={handleClose} pubkey={pubkey} />)}
    </Box>
  );

}
