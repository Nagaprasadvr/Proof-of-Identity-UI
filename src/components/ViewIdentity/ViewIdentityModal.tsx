import { Dispatch, SetStateAction, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import * as digitalIdentity from "../../digitalIdentity/js/src/generated"

interface ViewIdentityModalProps {
    handleClose: () => void,
    open: boolean,
    data: digitalIdentity.DigitalIdentity

}
const ViewIdentityModal = ({ handleClose, open, data }: ViewIdentityModalProps
) => {



    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black" }}>
            <Box>
                <Box style={{ backgroundColor: "black" }}>
                    <button style={{ backgroundColor: "transparent", borderColor: "transparent" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
                </Box>
                <Box sx={{ color: "lightskyblue", display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", width: "100vw", height: "100vh", }}>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        Name:{data.name}
                    </Typography>

                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"} >
                        dob:{data.dob}
                    </Typography>

                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        aadharNumber:{data.aadharNumber}
                    </Typography>

                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        panNumber:{data.panNumber}
                    </Typography>

                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        passportNumber:{data.passportId}
                    </Typography>
                </Box>


            </Box>

        </Modal>
    )
}

export default ViewIdentityModal;