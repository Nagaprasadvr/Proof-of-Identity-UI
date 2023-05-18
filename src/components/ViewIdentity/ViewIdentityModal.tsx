import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import * as digitalIdentity from "../../digitalIdentity/js/src/generated";
import "./viewstyle.css";
import { ChangeEvent } from "react";


interface ViewIdentityModalProps {
    handleClose: () => void,
    open: boolean,
    data: digitalIdentity.DigitalIdentity

}
const ViewIdentityModal = ({ handleClose, open, data }: ViewIdentityModalProps
) => {
  const [pic, setPic] = useState<File | null>(null);
  const [passport, setPassport] = useState<File | null>(null);
  const [pan, setPan] = useState<File | null>(null);
  const [aadhar, setAadhar] = useState<File | null>(null);

  const handleFile1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPic(selectedFile || null);
  };

  const handleFile2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPassport(selectedFile || null);
  };

  const handleFile3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setPan(selectedFile || null);
  };

     const handleFile4Change = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setAadhar(selectedFile || null);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // Perform file upload or any other necessary actions
    if (pic && pan && passport && aadhar) {
      console.log('Selected files:', pic, pan, passport, aadhar);
      // Perform file upload logic here
    } else {
      console.log('Please select all files');
      }
      
         // Reset the form
    setPic(null);
    setPan(null);
    setPassport(null);
    setAadhar(null);
  };

  

   

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
                        panNumber:{data.panNumber.toString()}
                    </Typography>

                    <form action="" method="get" onSubmit={handleSubmit}>
                         <Box sx={{display: "flex", flexDirection: "row"}}>
                            <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        picUploaded:{data.picAttached.toString()}
                            </Typography>{!data.picAttached && (<input type="file" onChange={handleFile1Change} />)}
                            </Box>
                         <Box>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        passportUploaded:{data.passportAttached.toString()}
                            </Typography>{!data.passportAttached && (<input type="file" onChange={handleFile2Change} />)}</Box>
                         <Box>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        panUploaded:{data.panAttached.toString()}
                            </Typography>{!data.panAttached && (<input type="file" onChange={handleFile3Change} />)}</Box>
                        
                         <Box>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        aadharUploaded:{data.aadharAttached.toString()}
                            </Typography>{!data.aadharAttached && (<input type="file" onChange={handleFile4Change} />)}</Box> 
                         <button type="submit">Upload</button>
                    </form>
                    

                </Box>


            </Box>

        </Modal>
    )
}

export default ViewIdentityModal;