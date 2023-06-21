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
import { reduceString } from '../ViewIdentity/helper';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    name: string;
    pubkey: string;
}

// interface RequestedData {
//     solPubkey: string;
//     rsaPubkey: string;
//     requestedSolPubkey: string;
//     senderName: string;
//     name: boolean;
//     dob: boolean;
//     aadharNum: boolean;
//     panNum: boolean;
//     passportNum: boolean;
//     panUploadLink: boolean;
//     passportUploadLink: boolean;
//     aadharUploadLink: boolean;
//     picUploadLink: boolean;
//     description: string;
//     address: string;
// }

function ResponseModal({ open, setOpen, id, name , pubkey}: Props) {
    const wallet = useWallet();
    interface reqprops {
        data: Record<string, any> | undefined;
        // solPubkey: string;
    }
    const [data, setData] = useState<reqprops>({ data: {} });
    const [reqPubkey, setReqPubkey] = useState('');
    const [reqData, setReqData] = useState<reqprops>();

    function DisplayKeyValuePairs({ data }: reqprops) {
        console.log(data)
        if (!data) {
            return null; // or any other handling for undefined data
        }

        const entries = Object.entries(data);
        setReqData(data.solPubkey)

        return (
            <div style={{display: 'flex', justifyContent: "center", flexDirection: "column", alignItems: "center" }}>
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
                        return <h3 key={key} style={{color: "white"}}>{key}</h3>;
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
                // console.log(response.data)
                setData(response.data.data);
                
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [id, data, reqPubkey]);

 

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
                        pubkey: reqPubkey,
                    })
                ).data.encryptedData;
                console.log('encData:', encData);
                // const res = await axios.post('http://localhost:9000/requests/approve', {});
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
                </Box>
                <Box style={{display: 'flex' , justifyContent: "space-between", flexDirection: "row"}}>
                    <h2 style={{ color: 'white', marginLeft: "3vw" }}><span style={{color: "lightskyblue"}}>Requester Name:</span> {name}</h2>
                    <h2 style={{ color: 'white', marginRight: "3vw" }}><span style={{color: "lightskyblue"}}>Pubkey:</span> {reduceString(pubkey,10)}</h2> 
                </Box>
                <Box style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'white', fontWeight: "bolder" }}>Requested Data</h1>
                </Box>
                <Box>
                    <DisplayKeyValuePairs data={data} />
                </Box>
                <Box style={{display: 'flex', justifyContent: 'space-around'}}>
                    <button className="balance-button w3-btn w3-hover-white" onClick={hanldeConfirm}>
                    Confirm
                </button>
                 </Box>
               
            </Box>
           
        </Modal>
    );
}

export default ResponseModal;
