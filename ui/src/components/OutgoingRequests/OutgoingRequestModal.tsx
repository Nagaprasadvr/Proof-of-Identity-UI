import React, { Dispatch, SetStateAction } from 'react';
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
import { Table } from 'react-bootstrap';
import { reduceString } from '../ViewIdentity/helper';
import { UserData } from '../InputForm/InputForm';
import './viewstyle.css';
import axios from 'axios';
import { ArweaveData, DataState } from '../ViewIdentity/ViewIdentityModal';
interface OutgoingProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
}

interface Data {
    [key: string]: string;
    aadharNum: string;
    aadharUploadLink: string;
    contactNum: string;
    dob: string;
    name: string;
    panNum: string;
    panUploadLink: string;
    passportNum: string;
    passportUploadLink: string;
    picUploadLink: string;
    requestId: string;
    residentAddress: string;
}

function OutgoingRequestModal({ open, setOpen, id }: OutgoingProps) {
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState<Data | null>(null);
    const [dataState, setDataState] = useState<DataState>(DataState.Encrypted);
    const [digitalIdentityData, setDigitalIdentityData] = useState<UserData | null>(null);
    const [digitalProofs, setDigitalProofs] = useState<ArweaveData | null>(null);
    console.log(id);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.post('http://localhost:9000/requests/getResponseById', { id: id });
                console.log(response.data);
                const responseData: Data = {
                    aadharNum: response.data[0].aadharNum,
                    aadharUploadLink: response.data[0].aadharUploadLink,
                    contactNum: response.data[0].contactNum,
                    dob: response.data[0].dob,
                    name: response.data[0].name,
                    panNum: response.data[0].panNum,
                    panUploadLink: response.data[0].panUploadLink,
                    passportNum: response.data[0].passportNum,
                    passportUploadLink: response.data[0].passportUploadLink,
                    picUploadLink: response.data[0].picUploadLink,
                    requestId: response.data[0].requestId,
                    residentAddress: response.data[0].residentAddress,
                };
                setData(responseData);
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, [id, refresh]);

    const handleDecryptEncryptData = async () => {
        toast.loading(dataState === DataState.Encrypted ? 'Decrypting..' : 'Encrypting...', { duration: 800 });
        console.log('data', data?.residentAddress);
        const userData: UserData = {
            aadharNumber: (data as Data).aadharNum,
            contactNumber: (data as Data).contactNum,
            dob: (data as Data).dob,
            name: (data as Data).name,
            panNumber: (data as Data).panNum,
            residenceAddress: (data as Data).residenceAddress,
            passportId: (data as Data).passportNum,
        };
        const arweaveData: ArweaveData = {
            panUploadLink: (data as Data).panUploadLink,
            aadharUploadLink: (data as Data).aadharUploadLink,
            passportUploadLink: (data as Data).passportUploadLink,
            picUploadLink: (data as Data).picUploadLink,
        };
        if (dataState === DataState.Encrypted) {
            try {
                console.log('user data', userData);
                console.log('arweave data', arweaveData);
                const response1 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: userData as UserData,
                    ticker: 'solData',
                });

                // const response2 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                //     encData: arweaveData as ArweaveData,
                //     ticker: 'arweaveData',
                // });

                setDataState(DataState.Decrypted);

                setDigitalIdentityData(response1.data.decryptedData);
                // setDigitalProofs(response2.data.decryptedData);
            } catch (e) {
                toast.error('failed to Decrypt data');
            }
        } else if (dataState === DataState.Decrypted) {
            setDigitalIdentityData(userData);
            setDigitalProofs(arweaveData);
            setDataState(DataState.Encrypted);
        }
    };

    // const handleDecryptEncryptProofs = async () => {
    //     toast.loading(proofsState === DataState.Encrypted ? 'Decrypting..' : 'Encrypting...', { duration: 800 });
    //     if (digitalProofs) {
    //         const arweaveData: ArweaveData = {
    //             panUploadLink: digitalProofs.panUpload,
    //             aadharUploadLink: digitalProofs.aadharUpload,
    //             passportUploadLink: digitalProofs.passportUpload,
    //             picUploadLink: digitalProofs.pictureUpload,
    //         };
    //         try {
    //             if (proofsState === DataState.Encrypted) {
    //                 const response2 = await axios.post('http://localhost:9000/cryptography/decryptData', {
    //                     encData: arweaveData,
    //                     ticker: 'arweaveData',
    //                 });
    //                 const decryptedArweaveData = response2.data.decryptedData as ArweaveData;
    //                 setProofsState(DataState.Decrypted);
    //                 setArweaveData(decryptedArweaveData);
    //             } else if (proofsState === DataState.Decrypted) {
    //                 setProofsState(DataState.Encrypted);
    //                 setArweaveData(arweaveData);
    //             }
    //         } catch (e) {
    //             toast.error('failed to Decrypt data');
    //         }
    //     }
    // };

    const handleRefresh = () => {
        toast.loading('Refreshing data', { duration: 2000 });
        setRefresh(!refresh);
    };

    return (
        <Modal
            open={open}
            onClose={() => setOpen(false)}
            style={{ width: '100vw', height: '100vh', background: 'black' }}
            sx={{ overflow: 'auto' }}
        >
            <Box>
                <Box style={{ backgroundColor: 'black' }}>
                    <button
                        style={{ backgroundColor: 'transparent', borderColor: 'transparent', color: 'lightskyblue' }}
                        onClick={() => {
                            setOpen(false);
                        }}
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
                <table>
                    <tbody>
                        {data &&
                            Object.keys(data as Data).map((key) => (
                                <tr key={key}>
                                    <td>{key}</td>
                                    <td>{data[key]}</td>
                                </tr>
                            ))}
                    </tbody>
                </table>
            </Box>
        </Modal>
    );
}

export default OutgoingRequestModal;
