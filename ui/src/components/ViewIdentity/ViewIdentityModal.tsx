import { Modal, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import * as digitalIdentity from '../../digitalIdentity/js/src/generated';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { WebBundlr } from '@bundlr-network/client';
import { useWallet } from '@solana/wallet-adapter-react';
import fileReaderStream from 'filereader-stream';
import { PublicKey } from '@solana/web3.js';
import { toast } from 'react-hot-toast';
import * as solana from '@solana/web3.js';
import './viewstyle.css';
import { Table } from 'react-bootstrap';
import { reduceString } from './helper';
import { UserData } from '../InputForm/InputForm';
import axios from 'axios';

interface ViewIdentityModalProps {
    handleClose: () => void;
    open: boolean;
    data: digitalIdentity.DigitalIdentity;
    pubkey: string;
    digitalIdentityPda: string;
}

interface fileObj {
    filename: string;
    file: File;
}

export enum DataState {
    Encrypted,
    Decrypted,
    NA,
}

export interface ArweaveData {
    panUploadLink: string;
    aadharUploadLink: string;
    passportUploadLink: string;
    picUploadLink: string;
}
const bgcolor = 'lightskyblue';
const ViewIdentityModal = ({ handleClose, open, data, pubkey, digitalIdentityPda }: ViewIdentityModalProps) => {
    const [fileArray, setFileArray] = useState<File[]>([]);
    const [pic, setPic] = useState<File | null>(null);
    const [passport, setPassport] = useState<File | null>(null);
    const [pan, setPan] = useState<File | null>(null);
    const [aadhar, setAadhar] = useState<File | null>(null);
    const [bundlr, setBundlr] = useState<WebBundlr>();
    const [arweaveUploads, setArweaveUploads] = useState<string[]>([]);
    const [proofsCreated, setProofsCreated] = useState<boolean>(false);
    const [digitalProofs, setDigitalProofs] = useState<digitalIdentity.DigitalProofs | null>(null);
    const [digitalProofsPda, setDigitalProofsPda] = useState<string>('');
    const [refresh, setRefresh] = useState(false);
    const [dataState, setDataState] = useState<DataState>(DataState.Encrypted);
    const [digIdentityData, setDigitalIdentityData] = useState<digitalIdentity.DigitalIdentity>(data);
    const [proofsState, setProofsState] = useState<DataState>(DataState.Encrypted);
    const [arweaveData, setArweaveData] = useState<ArweaveData | null>(null);

    const rpcCon = useMemo(() => {
        return new solana.Connection(solana.clusterApiUrl('devnet'));
    }, []);
    const arweaveLink = 'https://arweave.net/';

    const walletProvider = useWallet();
    useEffect(() => {
        const getDigitalProofs = async () => {
            try {
                if (walletProvider?.publicKey) {
                    const [digitalIdentityPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from('dig_identity'), walletProvider?.publicKey.toBuffer()],
                        digitalIdentity.PROGRAM_ID
                    );
                    const [digitalProofsPda] = PublicKey.findProgramAddressSync(
                        [Buffer.from('dig_proof'), digitalIdentityPda.toBuffer()],
                        digitalIdentity.PROGRAM_ID
                    );
                    const digitalProofsAcc = await digitalIdentity.DigitalProofs.fromAccountAddress(
                        rpcCon,
                        digitalProofsPda
                    );
                    setDigitalProofs(digitalProofsAcc);
                    const arweaveData: ArweaveData = {
                        panUploadLink: digitalProofsAcc.panUpload,
                        aadharUploadLink: digitalProofsAcc.aadharUpload,
                        passportUploadLink: digitalProofsAcc.passportUpload,
                        picUploadLink: digitalProofsAcc.pictureUpload,
                    };

                    setProofsCreated(true);
                    setDigitalProofsPda(digitalProofsPda.toBase58());
                    setArweaveData(arweaveData);
                }
            } catch (e) {
                console.error(e);
            }
        };

        if (walletProvider.connected && data) {
            getDigitalProofs();
        }
    }, [data, digitalIdentityPda, rpcCon, walletProvider.connected, walletProvider?.publicKey, refresh]);

    useEffect(() => {
        const getBundlrInstance = async () => {
            try {
                if (walletProvider?.publicKey) {
                    const bundlr = new WebBundlr('http://node2.bundlr.network', 'solana', walletProvider);
                    await bundlr.ready();
                    setBundlr(bundlr);
                }
            } catch (e) {
                console.error('error in connecting to Bundlr');
            }
        };
        if (walletProvider?.connected && digitalProofs === null) getBundlrInstance();
    }, [digitalProofs, walletProvider]);

    const handleDecryptEncryptData = async () => {
        toast.loading(dataState === DataState.Encrypted ? 'Decrypting..' : 'Encrypting...', { duration: 800 });
        if (dataState === DataState.Encrypted) {
            try {
                const response1 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: data,
                    ticker: 'solData',
                });

                setDataState(DataState.Decrypted);

                setDigitalIdentityData(response1.data.decryptedData);
            } catch (e) {
                toast.error('failed to Decrypt data');
            }
        } else if (dataState === DataState.Decrypted) {
            setDigitalIdentityData(data);
            setDataState(DataState.Encrypted);
        }
    };

    const handleDecryptEncryptProofs = async () => {
        toast.loading(proofsState === DataState.Encrypted ? 'Decrypting..' : 'Encrypting...', { duration: 800 });
        if (digitalProofs) {
            const arweaveData: ArweaveData = {
                panUploadLink: digitalProofs.panUpload,
                aadharUploadLink: digitalProofs.aadharUpload,
                passportUploadLink: digitalProofs.passportUpload,
                picUploadLink: digitalProofs.pictureUpload,
            };
            try {
                if (proofsState === DataState.Encrypted) {
                    const response2 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                        encData: arweaveData,
                        ticker: 'arweaveData',
                    });
                    const decryptedArweaveData = response2.data.decryptedData as ArweaveData;
                    setProofsState(DataState.Decrypted);
                    setArweaveData(decryptedArweaveData);
                } else if (proofsState === DataState.Decrypted) {
                    setProofsState(DataState.Encrypted);
                    setArweaveData(arweaveData);
                }
            } catch (e) {
                toast.error('failed to Decrypt data');
            }
        }
    };

    const handleRefresh = () => {
        toast.loading('Refreshing data', { duration: 2000 });
        setRefresh(!refresh);
    };

    const handleFile1Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const selectedFile = event.target.files[0];
            if (selectedFile) {
                setPic(selectedFile);
            }
        }
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
    const uploadFile = async () => {
        try {
            if (bundlr) {
                if (pic && aadhar && passport && pan) {
                    const arweaveLinks: string[] = [];
                    let uploadCount = 0;
                    const fileArray: fileObj[] = [
                        { filename: 'pan', file: pan },
                        { filename: 'aadhar', file: aadhar },
                        { filename: 'passport', file: passport },
                        { filename: 'pic', file: pic },
                    ];
                    for (const fileObj of fileArray) {
                        const id = toast.loading(`Uploading ${fileObj.filename} to Arweave..`);
                        try {
                            const dataStream = fileReaderStream(fileObj.file);
                            // const size = fileObj.file.size;
                            // console.log(size);
                            // const price = await bundlr.getPrice(size);
                            // console.log(price);
                            // await bundlr.fund(price)
                            const tx = await bundlr.upload(dataStream, {
                                tags: [{ name: 'Content-Type', value: (fileObj.file as File).type }],
                            });
                            const link = `${tx.id}`;
                            toast.dismiss(id);
                            toast.success(`${fileObj.filename} upload Success`);
                            arweaveUploads.push(link);
                            uploadCount++;
                        } catch (e) {
                            toast.dismiss(id);
                            toast.error(`${fileObj.filename} Upload Failed`);
                            console.error(e);
                        }
                    }

                    toast.success(`${uploadCount} files uploaded to Arweave Successfully`);

                    if (uploadCount === 4 && walletProvider?.publicKey) {
                        setArweaveUploads(arweaveLinks);
                        //smart contract call
                        const id = toast.loading('Creating Proofs Account');
                        try {
                            const [digitalIdentityPda, bump1] = PublicKey.findProgramAddressSync(
                                [Buffer.from('dig_identity'), walletProvider?.publicKey.toBuffer()],
                                digitalIdentity.PROGRAM_ID
                            );
                            const [digitalProofsPda, bump2] = PublicKey.findProgramAddressSync(
                                [Buffer.from('dig_proof'), digitalIdentityPda.toBuffer()],
                                digitalIdentity.PROGRAM_ID
                            );
                            const proofsAccount: digitalIdentity.CreateProofsInstructionAccounts = {
                                digIdentityAcc: digitalIdentityPda,
                                authority: walletProvider?.publicKey,
                                digProofsAcc: digitalProofsPda,
                                systemProgram: solana.SystemProgram.programId,
                            };
                            const links: ArweaveData = {
                                panUploadLink: arweaveUploads[0] as string,
                                aadharUploadLink: arweaveUploads[1] as string,
                                passportUploadLink: arweaveUploads[2] as string,
                                picUploadLink: arweaveUploads[3] as string,
                            };

                            const res = await axios.post('http://localhost:9000/cryptography/encryptData', {
                                plainData: links,
                                ticker: 'arweaveData',
                            });

                            const encArweaveData = res.data.encryptedData as ArweaveData;
                            const proofsAccArgs: digitalIdentity.CreateProofsInstructionArgs = {
                                createProofsParam: {
                                    panUpload: encArweaveData.panUploadLink as string,
                                    aadharUpload: encArweaveData.aadharUploadLink as string,
                                    passportUpload: encArweaveData.passportUploadLink as string,
                                    pictureUpload: encArweaveData.picUploadLink as string,
                                },
                            };
                            const ix0 = digitalIdentity.createCreateProofsInstruction(proofsAccount, proofsAccArgs);

                            if (walletProvider.signTransaction) {
                                const tx0 = new solana.Transaction().add(ix0);

                                tx0.recentBlockhash = (await rpcCon.getLatestBlockhash()).blockhash;
                                tx0.feePayer = walletProvider.publicKey;
                                try {
                                    const signature = await walletProvider.sendTransaction(tx0, rpcCon);
                                    if (signature) {
                                        setProofsCreated(true);
                                        const txSig = `https://explorer.solana.com/tx/${signature} `;
                                        toast.dismiss(id);
                                        setProofsState(DataState.Encrypted);
                                        toast.success(
                                            <>
                                                <Box>
                                                    <p style={{ color: 'black' }}>
                                                        Digital Proofs Account has been created Successfully with tx
                                                    </p>
                                                    <a href={txSig}>Tx</a>
                                                </Box>
                                            </>
                                        );
                                    }
                                } catch (e) {
                                    toast.dismiss(id);
                                    toast.error(' proofs Account creation failed');
                                    console.error(e);
                                }
                            }
                        } catch (e) {
                            toast.dismiss(id);
                            toast.error(' proofs Account creation failed');
                            console.error(e);
                        }
                    }
                } else {
                    toast.error('upload all assets to create Proofs Account');
                }
            }
        } catch (e) {
            console.error('error in uploading');
        }
    };

    // const handleSubmit = async (event: React.FormEvent) => {
    //     event.preventDefault();
    //     setRefresh(!refresh);
    //     // Perform file upload or any other necessary actions
    //     if (pic && pan && passport && aadhar) {
    //         // const newArray = [...fileArray, pic, pan, passport, aadhar];
    //         uploadFile();
    //         // Perform file upload logic here
    //     } else {
    //         toast.error('please select all files');
    //     }

    //     // Reset the form
    //     // setPic(null);
    //     // setPan(null);
    //     // setPassport(null);
    //     // setAadhar(null);
    // };

    const RenderUploadedLinksTable = useMemo(() => {
        if (open === true && arweaveData) {
            return (
                <>
                    <Box
                        sx={{
                            marginBottom: '90px',
                            marginTop: '50px',
                            display: 'flex',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            justifyItems: 'center',
                            alignContent: 'center',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <button
                                className="centered-button balance-button w3-btn w3-hover-white App"
                                style={{ width: '150px' }}
                                onClick={handleDecryptEncryptProofs}
                            >
                                {proofsState === DataState.Encrypted ? 'Decrypt Links' : 'Encrypt Links'}
                            </button>
                        </Box>

                        <Table
                            style={{
                                height: 'auto',
                                width: '90vw',
                                marginLeft: '5vw',
                                border: '3px solid white',
                                marginTop: '5vh',
                            }}
                            hover={true}
                        >
                            <tbody>
                                <tr style={{ color: 'black', background: '#728FCE' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        digitalProofsPdaAddress
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            width: '20vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {reduceString(digitalProofsPda as string, 5)}
                                    </td>
                                </tr>
                                <tr style={{ color: 'black', background: `${bgcolor}` }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Arweave PAN Link
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            width: '20vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {proofsState === DataState.Encrypted ? (
                                            reduceString(arweaveData?.panUploadLink as string, 5)
                                        ) : (
                                            <a
                                                href={arweaveLink + arweaveData?.panUploadLink}
                                                style={{ color: 'black' }}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                PAN Arweve link
                                            </a>
                                        )}
                                    </td>
                                </tr>
                                <tr style={{ color: 'black', background: `${bgcolor}` }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Arweave AadharLink
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            width: '20vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {proofsState === DataState.Encrypted ? (
                                            reduceString(arweaveData?.aadharUploadLink as string, 5)
                                        ) : (
                                            <a
                                                href={arweaveLink + arweaveData?.aadharUploadLink}
                                                style={{ color: 'black' }}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Aadhaar Arweve link
                                            </a>
                                        )}
                                    </td>
                                </tr>
                                <tr style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Arweave Passport Link
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            width: '20vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {proofsState === DataState.Encrypted ? (
                                            reduceString(arweaveData?.passportUploadLink as string, 5)
                                        ) : (
                                            <a
                                                href={(arweaveLink + arweaveData?.passportUploadLink) as string}
                                                style={{ color: 'black' }}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Passport Arweve link
                                            </a>
                                        )}
                                    </td>
                                </tr>
                                <tr style={{ color: 'black', background: `${bgcolor}` }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Arweave Image Link
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            width: '20vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {proofsState === DataState.Encrypted ? (
                                            reduceString(arweaveData?.picUploadLink as string, 5)
                                        ) : (
                                            <a
                                                href={(arweaveLink + arweaveData?.picUploadLink) as string}
                                                style={{ color: 'black' }}
                                                target="_blank"
                                                rel="noreferrer"
                                            >
                                                Pic Arweve link
                                            </a>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Box>
                </>
            );
        } else {
            return (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <h1>Loading ...</h1>
                    </Box>
                </>
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        open,
        refresh,
        digitalProofsPda,
        digitalProofs?.pictureUpload,
        digitalProofs?.passportUpload,
        digitalProofs?.panUpload,
        digitalProofs?.aadharUpload,
        proofsState,
    ]);

    const RenderUploadLinksTable = useMemo(() => {
        if (open) {
            return (
                // <form action="" method="get" onSubmit={handleSubmit}>
                <>
                    <Table
                        style={{
                            height: 'auto',
                            width: '90vw',
                            marginLeft: '5vw',
                            border: '3px solid white',
                            marginTop: '10vh',
                        }}
                        hover={true}
                    >
                        <tbody>
                            {!data.panAttached && (
                                <tr style={{ color: 'black', background: '#728FCE' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        PAN uploaded
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {!data.panAttached && (
                                            <input type="file" onChange={handleFile3Change} required />
                                        )}
                                    </td>
                                </tr>
                            )}
                            {!data.aadharAttached && (
                                <tr style={{ color: 'black', background: '#728FCE' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Aadhar Uploaded
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {!data.aadharAttached && (
                                            <input type="file" onChange={handleFile4Change} required />
                                        )}
                                    </td>
                                </tr>
                            )}

                            {!data.passportAttached && (
                                <tr style={{ color: 'black', background: '#728FCE' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Passport Uploaded
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {!data.passportAttached && (
                                            <input type="file" onChange={handleFile2Change} required />
                                        )}
                                    </td>
                                </tr>
                            )}
                            {!data.picAttached && (
                                <tr style={{ color: 'black', background: '#728FCE' }}>
                                    <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                        Pic Uploaded
                                    </td>
                                    <td
                                        style={{
                                            color: 'black',
                                            paddingLeft: '2vw',
                                            background: `${bgcolor}`,
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {!data.picAttached && (
                                            <input type="file" onChange={handleFile1Change} required />
                                        )}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                    <Box sx={{ display: 'flex', alignContent: 'center', justifyContent: 'center' }}>
                        <h6 style={{ color: 'lightskyblue' }}>*File size should be less than 50KB</h6>
                    </Box>

                    <div className="container" style={{ marginBottom: '4px' }}>
                        <button
                            className="centered-button balance-button w3-btn w3-hover-white App"
                            style={{ width: 'auto' }}
                            // type="submit"
                            onClick={() => {
                                toast.loading('Uploading...', { duration: 2000 });
                                setTimeout(() => {
                                    uploadFile();
                                }, 2000);
                            }}
                        >
                            Upload
                        </button>
                    </div>
                </>
                // </form>
            );
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [
        open,
        refresh,
        data.picAttached,
        data.passportAttached,
        data.panAttached,
        data.aadharAttached,
        pic,
        pan,
        passport,
        aadhar,
    ]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            style={{ width: '100vw', height: '100vh', background: 'black' }}
            sx={{ overflow: 'auto' }}
        >
            <Box>
                <Box style={{ backgroundColor: 'black' }}>
                    <button
                        style={{ backgroundColor: 'transparent', borderColor: 'transparent', color: 'lightskyblue' }}
                        onClick={handleClose}
                    >
                        <CancelIcon style={{ color: 'lightskyblue', fontSize: '50px' }}></CancelIcon>
                    </button>
                </Box>
                <Box
                    style={{
                        width: 'auto',
                        marginBottom: '2vh',
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                    }}
                    sx={{ gap: '30px' }}
                >
                    <button
                        className="centered-button balance-button w3-btn w3-hover-white App"
                        style={{ width: 'auto' }}
                        type="submit"
                        onClick={handleRefresh}
                    >
                        Refresh
                    </button>
                    <button
                        className="centered-button balance-button w3-btn w3-hover-white App"
                        style={{ width: 'auto' }}
                        type="submit"
                        onClick={handleDecryptEncryptData}
                    >
                        {dataState === DataState.Encrypted ? 'Decrypt Data' : 'Encrypt Data'}
                    </button>
                </Box>

                <Table
                    style={{
                        height: 'auto',
                        width: '90vw',
                        marginLeft: '5vw',
                        border: '3px solid white',
                        marginTop: '5vh',
                    }}
                    hover={true}
                >
                    <tbody>
                        <tr style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>Name</td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    width: '20vw',
                                    background: `${bgcolor}`,
                                    fontWeight: 'bold',
                                }}
                            >
                                {dataState === DataState.Encrypted
                                    ? reduceString(digIdentityData.name, 5)
                                    : digIdentityData.name}
                            </td>
                        </tr>

                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>Pubkey</td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    fontWeight: 'bold',
                                    width: '20vw',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {reduceString(pubkey, 5)}
                            </td>
                        </tr>
                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                DIgitalIdentityAddress
                            </td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    fontWeight: 'bold',
                                    width: '20vw',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {reduceString(digitalIdentityPda, 5)}
                            </td>
                        </tr>
                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>DOB</td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    fontWeight: 'bold',
                                    width: '20vw',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {dataState === DataState.Encrypted
                                    ? reduceString(digIdentityData.dob, 5)
                                    : digIdentityData.dob}
                            </td>
                        </tr>
                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                AadharNumber
                            </td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    fontWeight: 'bold',
                                    width: '20vw',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {dataState === DataState.Encrypted
                                    ? reduceString(digIdentityData.aadharNumber, 5)
                                    : digIdentityData.aadharNumber}
                            </td>
                        </tr>
                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>PanNumber</td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    width: '20vw',
                                    fontWeight: 'bold',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {dataState === DataState.Encrypted
                                    ? reduceString(digIdentityData.panNumber.toString(), 5)
                                    : digIdentityData.panNumber}
                            </td>
                        </tr>
                        <tr style={{ color: 'black', background: '#728FCE' }}>
                            <td style={{ color: 'black', background: `${bgcolor}`, fontWeight: 'bold' }}>
                                PassportNumber
                            </td>
                            <td
                                style={{
                                    color: 'black',
                                    paddingLeft: '2vw',
                                    width: '20vw',
                                    fontWeight: 'bold',
                                    background: `${bgcolor}`,
                                }}
                            >
                                {dataState === DataState.Encrypted
                                    ? reduceString(digIdentityData.passportId.toString(), 5)
                                    : digIdentityData.passportId}
                            </td>
                        </tr>
                    </tbody>
                </Table>

                {!proofsCreated ? <>{RenderUploadLinksTable}</> : <>{RenderUploadedLinksTable}</>}
            </Box>
        </Modal>
    );
};

export default ViewIdentityModal;
