import React from "react";
import "../../App.css";
import { InputPubkey } from "./inputForm";
import { Box } from '@mui/material';
import { useWallet } from "@solana/wallet-adapter-react";
import * as sdk from "../../digitalIdentity/js/src/generated"

interface ViewIdentityProps {
    connected: boolean;
    digIdentityAcc: sdk.DigitalIdentity | null
}

export const ViewIdentity = ({ connected, digIdentityAcc }: ViewIdentityProps) => {
    const wallet = useWallet();



    return (

        <>{connected ? (
            wallet.connected ? (
                <Box className="w3-animate-opacity App" sx={{
                    marginTop: "20vh", width: "100vw"
                }}>
                    <InputPubkey digIdentityAccState={digIdentityAcc} />
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