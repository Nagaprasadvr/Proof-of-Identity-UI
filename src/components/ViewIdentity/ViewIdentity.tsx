import React from "react";
import "../../App.css";
import { InputPubkey } from "./inputForm";
import { Box } from '@mui/material';
export const ViewIdentity = () => {
    return (

        <Box className="w3-animate-opacity App">
            <InputPubkey />
        </Box>
    )
}