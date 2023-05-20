import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Modal, Box, Typography } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import * as digitalIdentity from "../../digitalIdentity/js/src/generated";
import "./viewstyle.css";
import { ChangeEvent } from "react";
import { WebBundlr } from "@bundlr-network/client";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-wallets";
import { PhantomWalletAdapterConfig } from "@solana/wallet-adapter-wallets";
import { PhantomWalletName } from "@solana/wallet-adapter-wallets";
import { useWallet } from "@solana/wallet-adapter-react";
import fileReaderStream from "filereader-stream";
import { PublicKey } from "@solana/web3.js";

interface ViewIdentityModalProps {
    handleClose: () => void,
    open: boolean,
    data: digitalIdentity.DigitalIdentity
    pubkey: string
    digitalIdentityPda: string

}
const ViewIdentityModal = ({ handleClose, open, data, pubkey, digitalIdentityPda }: ViewIdentityModalProps
) => {
    const [fileArray, setFileArray] = useState([]);
    const [pic, setPic] = useState<File | null>(null);
    const [passport, setPassport] = useState<File | null>(null);
    const [pan, setPan] = useState<File | null>(null);
    const [aadhar, setAadhar] = useState<File | null>(null);
    const [bundlr, setBundlr] = useState<WebBundlr>();

    const walletProvider = useWallet();

    useEffect(() => {
        const getBundlrInstance = async () => {
            try {

                if (walletProvider?.publicKey) {
                    const bundlr = new WebBundlr("http://node2.bundlr.network", "solana", walletProvider);
                    await bundlr.ready()
                    console.log("firing")
                    setBundlr(bundlr)
                    console.log("bunldr:", bundlr)
                }


            }
            catch (e) {
                console.error("error in connecting to Bundlr")
            }

        }

        getBundlrInstance()
    }, [walletProvider])

    const uploadFile = async () => {
        console.log("clicked")
        try {
            console.log(bundlr)
            if (bundlr) {
                const dataStream = fileReaderStream(pic);
                const tx = await bundlr.upload(dataStream, {
                    tags: [{ name: "Content-Type", value: "pptx" }],
                });
                console.log(tx);
                console.log(`File uploaded ==> https://arweave.net/${tx.id}`);
            }
        }
        catch (e) {
            console.error("error in uploading")
        }

    }

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

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        // Perform file upload or any other necessary actions
        if (pic && pan && passport && aadhar) {
            // console.log('Selected files:', pic, pan, passport, aadhar);
            const newArray = [...fileArray, pic, pan, passport, aadhar];
            console.log(newArray[0]);


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
                    <button style={{ backgroundColor: "transparent", borderColor: "transparent", color: "lightskyblue" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
                </Box>
                <Box sx={{ color: "lightskyblue", display: "flex", flexDirection: "column", justifyContent: "center", alignContent: "center", width: "100vw", height: "100vh",  }}>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        Name:{data.name}
                    </Typography>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        Pubkey:{pubkey}
                    </Typography>
                    <Typography fontFamily={'Roboto Mono,monospace'} fontSize={"30px"} fontWeight={"bold"}>
                        DIgitalIdentityAddress:{digitalIdentityPda}
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
                        <Box sx={{ display: "flex", flexDirection: "row" }}>
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
                        <button type="submit" onClick={() => uploadFile()}>Upload</button>
                    </form>


                </Box>


            </Box>

        </Modal>
    )
}

export default ViewIdentityModal;