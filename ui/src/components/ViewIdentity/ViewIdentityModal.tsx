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
    const rpcCon = useMemo(() => {
        return new solana.Connection(solana.clusterApiUrl("devnet"))
    }, [])
    const arweaveLink = "https://arweave.net/"


    const walletProvider = useWallet();
    useEffect(() => {
        const getDigitalProofs = async () => {

            try {
                if (walletProvider?.publicKey) {
                    const [digitalIdentityPda, bump1] = PublicKey.findProgramAddressSync([Buffer.from("dig_identity"), walletProvider?.publicKey.toBuffer()], digitalIdentity.PROGRAM_ID)
                    const [digitalProofsPda, bump2] = PublicKey.findProgramAddressSync([Buffer.from("dig_proof"), digitalIdentityPda.toBuffer()], digitalIdentity.PROGRAM_ID);
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

    }, [data, digitalIdentityPda, rpcCon, walletProvider.connected, walletProvider?.publicKey])


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
                                // const signedTx0 = await walletProvider.signTransaction(tx0);
                                try {
                                    const signature = await walletProvider.sendTransaction(tx0, rpcCon);
                                    // const signature = solana.sendAndConfirmTransaction(rpcCon, signedTx0, [walletProvider.wallet as solana.Signer])
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
            const newArray = [...fileArray, pic, pan, passport, aadhar];
            // Perform file upload logic here
        } else {
            toast.error("please select all files")
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
                <Table style={{ height: "auto", width: "90vw", marginLeft: "5vw", border: "3px solid white" }}>
                    <thead>
                        <tr>
                            <th style={{ color: "white" }}>Name:</th>
                            <th style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{data.name}</th>
                        </tr>

                    </thead>
                    <tbody>
                        <tr>
                            <td style={{ color: "white" }}>Pubkey</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{pubkey}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>DIgitalIdentityAddress</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{digitalIdentityPda}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>DOB</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{data.dob}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>AadharNumber</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>{data.aadharNumber}</td>
                        </tr>
                        <tr>
                            <td style={{ color: "white" }}>PanNumber</td>
                            <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                {data.panNumber.toString()}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {!proofsCreated ? (<form action="" method="get" onSubmit={handleSubmit}>
                    <Table style={{ height: "auto", width: "90vw", marginLeft: "5vw", border: "3px solid white" }}>
                        <tbody>
                            {
                                !data.picAttached && (<tr>
                                    <td style={{ color: "white" }}> Pic uploaded</td>
                                    <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                        {!data.picAttached && (<input type="file" onChange={handleFile1Change} />)}
                                    </td>
                                </tr>)
                            }
                            {
                                !data.passportAttached && (<tr>
                                    <td style={{ color: "white" }}>Passport Uploaded</td>
                                    <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                        {!data.passportAttached && (<input type="file" onChange={handleFile2Change} />)}
                                    </td>
                                </tr>)
                            }

                            {
                                !data.panAttached && (<tr>
                                    <td style={{ color: "white" }}>
                                        Pan Uploaded
                                    </td>
                                    <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                        {!data.panAttached && (<input type="file" onChange={handleFile3Change} />)}
                                    </td>
                                </tr>)
                            }
                            {
                                !data.aadharAttached && (<tr>
                                    <td style={{ color: "white" }}>Aadhar Uploaded</td>
                                    <td style={{ color: "lightskyblue", paddingLeft: "2vw" }}>
                                        {!data.aadharAttached && (<input type="file" onChange={handleFile4Change} />)}
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </Table>
                    <div className="container">
                        <button className="centered-button balance-button w3-btn w3-hover-white App" style={{ width: "auto" }} type="submit" onClick={() => uploadFile()}>Upload</button>
                    </div>
                </form>) : (
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
                            </tbody>
                        </Table>
                    </>

                )
                }


            </Box>




        </Modal>
    )
}

export default ViewIdentityModal;




