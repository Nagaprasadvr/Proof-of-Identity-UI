import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';
import { Modal } from '@material-ui/core';
import { Button, Table } from 'react-bootstrap';
import * as sdk from '../../digitalIdentity/js/src/generated';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { Data } from 'node-rsa';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { UserData } from '../InputForm/InputForm';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    name: string;
}

interface RequestedData {
    solPubkey: string;
    rsaPubkey: string;

    requestedSolPubkey: string;
    senderName: string;

    name: boolean;
    dob: boolean;

    aadharNum: boolean;

    panNum: boolean;

    passportNum: boolean;

    panUploadLink: boolean;

    passportUploadLink: boolean;
    aadharUploadLink: boolean;

    picUploadLink: boolean;

    description: string;

    address: string;
}

function ResponseModal({ open, setOpen, id, name }: Props) {
    const wallet = useWallet();
    const [data, setData] = useState<RequestedData | null>(null);
    interface reqprops {
        data: Record<string, any> | undefined;
    }

    const [reqData, setReqData] = useState<reqprops>();

    function DisplayKeyValuePairs({ data }: reqprops) {
        if (!data) {
            return null; // or any other handling for undefined data
        }

        const entries = Object.entries(data);

        return (
            <div>
                {entries.map(([key, value]) => {
                    const isTrue = Boolean(value);

                    if (
                        isTrue &&
                        key != '_id' &&
                        key != 'createdAt' &&
                        key != 'updatedAt' &&
                        key != 'rsaPubkey' &&
                        key != 'requestedSolPubkey' &&
                        key != 'solPubkey' &&
                        key != 'senderName'
                    ) {
                        return <p key={key}>{key}</p>;
                    } else {
                        return null;
                    }
                })}
            </div>
        );
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.post('http://localhost:9000/requests/get', { id: id });

                const reqData: RequestedData = {
                    name: response.data.data.name,
                    dob: response.data.data.dob,
                    aadharNum: response.data.data.aadharNum,
                    panNum: response.data.data.panNum,
                    passportNum: response.data.data.passportNum,
                    panUploadLink: response.data.data.panUploadLink,
                    passportUploadLink: response.data.data.passportUploadLink,
                    aadharUploadLink: response.data.data.aadharUploadLink,
                    picUploadLink: response.data.data.picUploadLink,
                    description: response.data.data.description,
                    address: response.data.data.address,
                    solPubkey: response.data.data.solPubkey,
                    rsaPubkey: response.data.data.rsaPubkey,
                    requestedSolPubkey: response.data.data.requestedSolPubkey,
                    senderName: response.data.data.senderName,
                };

                setData(reqData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id]);

    // const handleChange = (event: any) => {
    //     if (event.target.type === 'checkbox') {
    //         setFormData({
    //             ...formData,
    //             [event.target.name]: event.target.checked ? 'true' : 'false',
    //         });
    //     } else {
    //         setFormData({
    //             ...formData,
    //             [event.target.name]: event.target.value,
    //         });
    //     }
    // };

    // const handleSubmit = async (event: any) => {
    //     event.preventDefault();
    //     // Perform form submission logic here
    //     const res = await axios.post('http://localhost:9000/requests/send', { senderName: formData.senderName, userPubkey: wallet.publicKey?.toBase58() })
    //     console.log("res:", res)
    //     // console.log(formData);
    //     setTimeout(() => {
    //         handleClose();
    //     }, 1000);
    // };

    const hanldeConfirm = async () => {
        console.log('confirm');
        toast.success('Confirmed');
        if (wallet?.publicKey && data) {
            try {
                const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync(
                    [Buffer.from('dig_identity'), wallet?.publicKey.toBuffer()],
                    sdk.PROGRAM_ID
                );
                const rpcConn = new Connection(clusterApiUrl('devnet'));
                const acc = await sdk.DigitalIdentity.fromAccountAddress(rpcConn, digitalPdaAcc);
                const response = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: acc as UserData,
                    ticker: 'solData',
                });

                const decryptedData = response.data.decryptedData;

                const encData = (
                    await axios.post('http://localhost:9000/cryptography/encryptDataWithPubkey', {
                        plainData: decryptedData as UserData,
                        ticker: 'solData',
                        pubkey: data.requestedSolPubkey,
                    })
                ).data.encryptedData;

                const res = await axios.post('http://localhost:9000/requests/approve', {});
            } catch (e) {
                console.log(e);
            }
        }
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'scroll' }}
        >
            <Box style={{ width: '100vw', height: '100vh' }}>
                <Box style={{ backgroundColor: 'black' }}>
                    <button
                        style={{ backgroundColor: 'transparent', borderColor: 'transparent', color: 'lightskyblue' }}
                        onClick={handleClose}
                    >
                        <CancelIcon style={{ color: 'lightskyblue', fontSize: '50px' }}></CancelIcon>
                    </button>

                    <button
                        style={{ backgroundColor: 'transparent', borderColor: 'transparent', color: 'lightskyblue' }}
                        onClick={hanldeConfirm}
                    >
                        Confirm
                    </button>
                </Box>
                <Box>
                    <h2>Requester Name: {name}</h2>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                    <h2>Requested Data</h2>
                </Box>
                <Box>
                    <DisplayKeyValuePairs data={reqData} />
                </Box>
            </Box>
        </Modal>
    );
}

export default ResponseModal;
