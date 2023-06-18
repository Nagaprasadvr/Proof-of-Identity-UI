import { Modal, Box } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import * as digitalIdentity from "../../digitalIdentity/js/src/generated";
import { useState, useMemo, useEffect } from "react";
import { WebBundlr } from "@bundlr-network/client";
import { useWallet } from "@solana/wallet-adapter-react";
import fileReaderStream from "filereader-stream";
import { PublicKey } from "@solana/web3.js";
import { toast } from "react-hot-toast";
import * as solana from "@solana/web3.js"
import "./viewstyle.css"
import { Table } from "react-bootstrap";
import { reduceString } from "./helper";
import { UserData } from "../InputForm/InputForm";
import axios from "axios";
interface ViewIdentityModalProps {
    handleClose: () => void,
    open: boolean,
    data: digitalIdentity.DigitalIdentity
    pubkey: string
    digitalIdentityPda: string

}

interface fileObj {
    filename: string,
    file: File
}

enum DataState {
    Encrypted,
    Decrypted
}
const ViewIdentityModal = ({ handleClose, open, data, pubkey, digitalIdentityPda }: ViewIdentityModalProps
) => {
    const [fileArray, setFileArray] = useState<File[]>([]);
    const [pic, setPic] = useState<File | null>(null);
    const [passport, setPassport] = useState<File | null>(null);
    const [pan, setPan] = useState<File | null>(null);
    const [aadhar, setAadhar] = useState<File | null>(null);
    const [bundlr, setBundlr] = useState<WebBundlr>();
    const [arweaveUploads, setArweaveUploads] = useState<string[]>([]);
    const [proofsCreated, setProofsCreated] = useState<boolean>(false);
    const [digitalProofs, setDigitalProofs] = useState<digitalIdentity.DigitalProofs | null>(null);
    const [digitalProofsPda, setDigitalProofsPda] = useState<string>("");
    const [refresh, setRefresh] = useState(false);
    const [dataState, setDataState] = useState<DataState>(DataState.Encrypted);
    const [digIdentityData, setDigitalIdentityData] = useState<digitalIdentity.DigitalIdentity>(data);


    const rpcCon = useMemo(() => {
        return new solana.Connection(solana.clusterApiUrl("devnet"))
    }, [])
    const arweaveLink = "https://arweave.net/"


    const walletProvider = useWallet();
    useEffect(() => {
        const getDigitalProofs = async () => {

            try {
                if (walletProvider?.publicKey) {
                    const [digitalIdentityPda] = PublicKey.findProgramAddressSync([Buffer.from("dig_identity"), walletProvider?.publicKey.toBuffer()], digitalIdentity.PROGRAM_ID)
                    const [digitalProofsPda] = PublicKey.findProgramAddressSync([Buffer.from("dig_proof"), digitalIdentityPda.toBuffer()], digitalIdentity.PROGRAM_ID);
                    const digitalProofsAcc = await digitalIdentity.DigitalProofs.fromAccountAddress(rpcCon, digitalProofsPda);
                    setDigitalProofs(digitalProofsAcc);
                    setProofsCreated(true);
                    setDigitalProofsPda(digitalProofsPda.toBase58())
                }

            }
            catch (e) {
                console.error(e)
            }

        }

        if (walletProvider.connected && data) {
            getDigitalProofs()
        }

    }, [data, digitalIdentityPda, rpcCon, walletProvider.connected, walletProvider?.publicKey, refresh])


    useEffect(() => {
        const getBundlrInstance = async () => {
            try {

                if (walletProvider?.publicKey) {
                    const bundlr = new WebBundlr("http://node2.bundlr.network", "solana", walletProvider);
                    await bundlr.ready()
                    setBundlr(bundlr)
                }


            }
            catch (e) {
                console.error("error in connecting to Bundlr")
            }

        }
        if (walletProvider?.connected && digitalProofs === null)
            getBundlrInstance()
    }, [digitalProofs, walletProvider])



    const uploadFile = async () => {
        console.log('firing')
        try {
            if (bundlr) {
                if (pic && aadhar && passport && pan) {

                    const arweaveLinks: string[] = []
                    let uploadCount = 0
                    const fileArray: fileObj[] = [{ filename: "pan", file: pan }, { filename: "aadhar", file: aadhar }, { filename: "passport", file: passport }, { filename: "pic", file: pic }]
                    for (const fileObj of fileArray) {
                        const id = toast.loading(`Uploading ${fileObj.filename} to Arweave..`)
                        try {
                            const dataStream = fileReaderStream(fileObj.file);
                            // const size = fileObj.file.size;
                            // console.log(size);
                            // const price = await bundlr.getPrice(size);
                            // console.log(price);
                            // await bundlr.fund(price)
                            const tx = await bundlr.upload(dataStream, {
                                tags: [{ name: "Content-Type", value: (fileObj.file as File).type }],
                            });
                            const link = `${tx.id}`
                            toast.dismiss(id);
                            toast.success(`${fileObj.filename} upload Success`)
                            arweaveUploads.push(link);
                            uploadCount++;
                        }
                        catch (e) {
                            toast.dismiss(id)
                            toast.error(`${fileObj.filename} Upload Failed`)
                            console.error(e)
                        }

                    }
                    toast.success(`${uploadCount} files uploaded to Arweave Successfully`);

                    if (uploadCount === 4 && walletProvider?.publicKey) {
                        setArweaveUploads(arweaveLinks);
                        //smart contract call
                        const id = toast.loading("Creating Proofs Account");
                        try {
                            const [digitalIdentityPda, bump1] = PublicKey.findProgramAddressSync([Buffer.from("dig_identity"), walletProvider?.publicKey.toBuffer()], digitalIdentity.PROGRAM_ID)
                            const [digitalProofsPda, bump2] = PublicKey.findProgramAddressSync([Buffer.from("dig_proof"), digitalIdentityPda.toBuffer()], digitalIdentity.PROGRAM_ID);
                            const proofsAccount: digitalIdentity.CreateProofsInstructionAccounts = {
                                digIdentityAcc: digitalIdentityPda,
                                authority: walletProvider?.publicKey,
                                digProofsAcc: digitalProofsPda,
                                systemProgram: solana.SystemProgram.programId

                            }
                            const proofsAccArgs: digitalIdentity.CreateProofsInstructionArgs = {
                                createProofsParam: {
                                    panUpload: arweaveUploads[0] as string,
                                    aadharUpload: arweaveUploads[1] as string,
                                    passportUpload: arweaveUploads[2] as string,
                                    pictureUpload: arweaveUploads[3] as string,
                                }

                            }
                            const ix0 = digitalIdentity.createCreateProofsInstruction(proofsAccount, proofsAccArgs);

                            if (walletProvider.signTransaction) {
                                const tx0 = new solana.Transaction().add(ix0);

                                tx0.recentBlockhash = (await rpcCon.getLatestBlockhash()).blockhash
                                tx0.feePayer = walletProvider.publicKey
                                try {
                                    const signature = await walletProvider.sendTransaction(tx0, rpcCon);
                                    if (signature) {
                                        setProofsCreated(true);
                                        const txSig = `https://explorer.solana.com/tx/${signature} `
                                        toast.dismiss(id)
                                        toast.success(<>
                                            <Box>
                                                <p style={{ color: "black" }}>Digital Proofs Account has been created Successfully with tx</p>
                                                <a href={txSig}>Tx</a>
                                            </Box>
                                        </>)
                                    }


                                }
                                catch (e) {
                                    toast.dismiss(id);
                                    toast.error(" proofs Account creation failed")
                                    console.error(e)
                                }


                            }
                        }
                        catch (e) {
                            toast.dismiss(id);
                            toast.error(" proofs Account creation failed")
                        }

                    }


                }
                else {
                    toast.error("upload all assets to create Proofs Account")
                }

            }
        }
        catch (e) {
            console.error("error in uploading")
        }

    }

    const handleFile1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setPic(selectedFile);
            }

        }
        console.log("pic fs:", pic)

    };

    const handleFile2Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setPassport(selectedFile);
            }

        }
    };

    const handleFile3Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setPan(selectedFile);
            }

        }
    };

    const handleFile4Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setAadhar(selectedFile);
            }

        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();

        console.log(pic, pan, passport, aadhar)

        // Perform file upload or any other necessary actions
        if (pic && pan && passport && aadhar) {
            // const newArray = [...fileArray, pic, pan, passport, aadhar];
            uploadFile()
            // Perform file upload logic here
        } else {
            toast.error("please select all files")
        }

        // Reset the form
        // setPic(null);
        // setPan(null);
        // setPassport(null);
        // setAadhar(null);
    };

    console.log("pic:", pic);

    console.log("pan:", pan);

    console.log("aadhar:", aadhar);

    console.log("pass:", passport);

    const RenderUploadedLinksTable = useMemo(() => {
        if (open === true) {
            return (
                <>
                    <Table style={{ height: "auto", width: "90vw", marginLeft: "5vw", border: "3px solid white" }}>
                        <tbody>
                            <tr>
                                <td>digitalProofsPdaAddress</td>
                                <td>{digitalProofsPda}</td>
                            </tr>
                            <tr>
                                <td>arweave-picUploadLink</td>
                                <td><a href={arweaveLink + digitalProofs?.pictureUpload} style={{ color: "white" }}>picture Arweve link</a></td>
                            </tr>
                            <tr>
                                <td>arweave-passportLink</td>
                                <td><a href={arweaveLink + digitalProofs?.passportUpload} style={{ color: "white" }}>passport Arweve link</a></td>
                            </tr>
                            <tr>
                                <td>arweave-panUploadLink</td>
                                <td><a href={arweaveLink + digitalProofs?.panUpload} style={{ color: "white" }}>pan Arweve link</a></td>
                            </tr>
                            <tr>
                                <td>arweave-aadharUploadLink</td>
                                <td><a href={arweaveLink + digitalProofs?.aadharUpload} style={{ color: "white" }}>aadhar Arweve link</a></td>
                            </tr>
                            <tr>

                            </tr>
                        </tbody>
                    </Table>

                </>

            )
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, refresh, digitalProofsPda, digitalProofs?.pictureUpload, digitalProofs?.passportUpload, digitalProofs?.panUpload, digitalProofs?.aadharUpload])

    const RenderUploadLinksTable = useMemo(() => {
        if (open) {

            return (

                < form action="" method="get" onSubmit={handleSubmit} >
                    <Table style={{ height: "auto", width: "90vw", marginLeft: "5vw", border: "3px solid white" }}>
                        <tbody>
                            {
                                !data.picAttached && (
                                    <tr>
                                        <td style={{ color: "white" }}>Pic uploaded</td>
                                        <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                            {!data.picAttached && (<input type="file" onChange={handleFile1Change} />)}
                                        </td>
                                    </tr>)
                            }
                            {
                                !data.passportAttached && (
                                    <tr>
                                        <td style={{ color: "white" }}>Passport Uploaded</td>
                                        <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                            {!data.passportAttached && (<input type="file" onChange={handleFile2Change} />)}
                                        </td>
                                    </tr>)
                            }

                            {
                                !data.panAttached && (
                                    <tr>
                                        <td style={{ color: "white" }}>
                                            Pan Uploaded
                                        </td>
                                        <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                            {!data.panAttached && (<input type="file" onChange={handleFile3Change} />)}
                                        </td>
                                    </tr>)
                            }
                            {
                                !data.aadharAttached && (
                                    <tr>
                                        <td style={{ color: "white" }}>Aadhar Uploaded</td>
                                        <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                            {!data.aadharAttached && (<input type="file" onChange={handleFile4Change} />)}
                                        </td>
                                    </tr>)
                            }
                        </tbody>
                    </Table>
                    <Box sx={{ display: "flex", alignContent: "center", justifyContent: "center" }}>
                        <h6 style={{ color: "lightskyblue" }}>*File size should be less than 50KB</h6>
                    </Box>


                    <div className="container" style={{ marginBottom: "4px" }}>
                        <button className="centered-button balance-button w3-btn w3-hover-white App" style={{ width: "auto" }} type="submit" >Upload</button>
                    </div>
                </form >

            )
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, refresh, data.picAttached, data.passportAttached, data.panAttached, data.aadharAttached])

    const handleDecryptEncrypt = async () => {

        toast.loading(dataState === DataState.Encrypted ? "Decrypting.." : "Encrypting...", { duration: 800 });
        if (dataState === DataState.Encrypted) {
            try {
                console.log("inside")
                const response = await axios.post("http://localhost:9000/cryptography/decryptData", { encData: data as UserData, ticker: "solData" });
                setDataState(DataState.Decrypted);

                setDigitalIdentityData(response.data.decryptedData)
            }
            catch (e) {
                toast.error("failed to Decrypt data")
            }

        }
        else if (dataState === DataState.Decrypted) {
            setDigitalIdentityData(data);
            setDataState(DataState.Encrypted)

        }


    }
    const handleRefresh = () => {
        toast.loading("Refreshing data", { duration: 2000 });
        setRefresh(!refresh);
    }
    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black" }} sx={{ overflow: "auto" }}>

            <Box>
                <Box style={{ backgroundColor: "black" }}>
                    <button style={{ backgroundColor: "transparent", borderColor: "transparent", color: "lightskyblue" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
                </Box>
                <Box style={{ width: "auto", marginBottom: "2vh", display: "flex", flexDirection: "row", justifyContent: "center" }} sx={{ gap: "30px" }}>
                    <button className="centered-button balance-button w3-btn w3-hover-white App" style={{ width: "auto" }} type="submit" onClick={handleRefresh}>Refresh</button>
                    <button className="centered-button balance-button w3-btn w3-hover-white App" style={{ width: "auto" }} type="submit" onClick={handleDecryptEncrypt}>{dataState === DataState.Encrypted ? "Decrypt" : "Encrypt"}</button>
                </Box>


                <Table style={{ height: "auto", width: "90vw", marginLeft: "5vw", border: "3px solid white" }}>
                    <thead>
                        <tr>
                            <th style={{ color: "white" }}>Name:</th>
                            <th style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{dataState === DataState.Encrypted ? reduceString(digIdentityData.name, 5) : digIdentityData.name}</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ color: "white" }}>Pubkey</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{reduceString(pubkey, 5)}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>DIgitalIdentityAddress</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{reduceString(digitalIdentityPda, 5)}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>DOB</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{dataState === DataState.Encrypted ? reduceString(digIdentityData.dob, 5) : digIdentityData.dob}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>AadharNumber</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{dataState === DataState.Encrypted ? reduceString(digIdentityData.aadharNumber, 5) : digIdentityData.aadharNumber}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>PanNumber</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                {dataState === DataState.Encrypted ? reduceString(digIdentityData.panNumber.toString(), 5) : digIdentityData.panNumber}
                            </td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>PassportNumber</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                {dataState === DataState.Encrypted ? reduceString(digIdentityData.passportId.toString(), 5) : digIdentityData.passportId}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {!proofsCreated ?
                    (

                        <>
                            {RenderUploadLinksTable}
                        </>
                    )
                    :
                    (
                        <>
                            {RenderUploadedLinksTable}
                        </>

                    )
                }


            </Box>




        </Modal >
    )
}

export default ViewIdentityModal;




