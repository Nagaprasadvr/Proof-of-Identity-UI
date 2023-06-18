import React, { useEffect, useState } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import * as sdk from "../../digitalIdentity/js/src/generated/"
import { useWallet } from "@solana/wallet-adapter-react";
import * as Buffer from "buffer"
import { Box } from '@mui/material';
import * as solana from "@solana/web3.js"
import toast from "react-hot-toast"
import ViewIdentityModal from "./ViewIdentityModal";

interface InputPubkeyProps {
  digIdentityAccState: sdk.DigitalIdentity | null
}
export const InputPubkey = ({ digIdentityAccState }: InputPubkeyProps) => {
  const [open, setOpen] = useState<boolean>(false)
  const [digIdentityAcc, setDigIdentityAcc] = useState<sdk.DigitalIdentity | null>(digIdentityAccState);
  const [digitalIdentityPda, setDigIdentityPda] = useState<string>("")
  const [pubkey, setPubkey] = useState<string>("")
  const wallet = useWallet();

  const rpcConn = new Connection(solana.clusterApiUrl("devnet"));
  useEffect(() => {
    if (wallet?.publicKey) {
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

    try {
      const publickey = new PublicKey(pubkey as string);
      await rpcConn.getAccountInfo(publickey)
      if (publickey.toBase58() !== wallet?.publicKey?.toBase58()) {
        toast.error("Connect Account associated with input Pubkey");
        return;
      }
    }
    catch (e) {
      console.error(e);
      toast.error("Invalid Pubkey");
      return;

    }
    const id = toast.loading("fetching Digital Identity");

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
          const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync([Buffer.Buffer.from("dig_identity"), wallet?.publicKey.toBuffer()], sdk.PROGRAM_ID)
          const acc = await sdk.DigitalIdentity.fromAccountAddress(rpcConn, digitalPdaAcc);

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
