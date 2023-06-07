import React from "react";
import "../../App.css";
import { InputPubkey } from "./inputForm";
import { Box } from '@mui/material';
import { useWallet } from "@solana/wallet-adapter-react";
import { ServerConnectionProps } from "../Home/Home";

export const ViewIdentity = ({ connected }: ServerConnectionProps) => {
    const wallet = useWallet();



    return (

        <>{connected ? (
            wallet.connected ? (
                <Box className="w3-animate-opacity App" sx={{
                    marginTop: "20vh", width: "100vw"
                }}>
                    <InputPubkey />
                </Box >)
                :
                <Box className="w3-animate-opacity App" sx={{ marginTop: "20vh", width: "100vw" }} >
                    <h1 >
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>
        ) : (
            <Box className="w3-animate-opacity App" sx={{ marginTop: "20vh", width: "100vw" }} >
                <h1 >
                    <b>Protocol Down!</b>
                </h1>
            </Box>

        )}


        </>


    )
}