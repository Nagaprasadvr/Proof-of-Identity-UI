import React from "react";
import "../../App.css";
import { InputPubkey } from "./inputForm";
import { Box } from '@mui/material';
import { useWallet } from "@solana/wallet-adapter-react";
export const ViewIdentity = () => {
    const wallet = useWallet();

    return (

        <>
            {wallet.connected ? (
                <Box className="w3-animate-opacity App" >
                    <InputPubkey />
                </Box >)
                :
                <Box className="w3-animate-opacity App" >
                    <h1 >
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>}

        </>


    )
}