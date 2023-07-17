import React, { Dispatch, SetStateAction, useState, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import { Modal } from '@material-ui/core';
import * as sdk from '../../digitalIdentity/js/src/generated';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { UserData } from '../InputForm/InputForm';
import { reduceString } from '../ViewIdentity/helper';
import * as digitalIdentity from '../../digitalIdentity/js/src/generated';
import { ArweaveData } from '../ViewIdentity/ViewIdentityModal';
import { Data } from './IncomingRequests';
interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    name: string;
    solpubkey: string;
    rsaPubkey512: string;
    rsaPubkey1028: string;
    requestedData: Data;
    setRefresh: Dispatch<SetStateAction<boolean>>;
    refresh: boolean;
}

function ResponseModal({
    open,
    setOpen,
    id,
    name,
    solpubkey,
    rsaPubkey1028,
    rsaPubkey512,
    requestedData,
    setRefresh,
    refresh,
}: Props) {
    const wallet = useWallet();
    interface reqprops {
        data: Record<string, any> | undefined;
        // solPubkey: string;
    }
    const [data, setData] = useState<reqprops>({ data: {} });
    const [reqPubkey, setReqPubkey] = useState('');
    const [reqData, setReqData] = useState<reqprops>();
    const [handleOpen, setHandleOpen] = useState(false);

    // console.log('rsaPubkey512 mod', rsaPubkey512);

    const handleCloseModal = () => {
        setHandleOpen(true);
    };

    function DisplayKeyValuePairs({ data }: reqprops) {
        console.log(data);
        if (!data) {
            return null; // or any other handling for undefined data
        }

        const entries = Object.entries(data);
        setReqData(data.solPubkey);

        return (
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center' }}>
                {entries.map(([key, value]) => {
                    const isTrue = Boolean(value);

                    if (
                        isTrue &&
                        key !== '_id' &&
                        key !== 'createdAt' &&
                        key !== 'updatedAt' &&
                        key !== 'rsaPubkey512' &&
                        key !== 'rsaPubkey1028' &&
                        key !== 'requestedSolPubkey' &&
                        key !== 'solPubkey' &&
                        key !== 'senderName' &&
                        key !== 'state' &&
                        key !== 'receiverName' &&
                        key !== 'description'
                    ) {
                        return (
                            <h3 key={key} style={{ color: 'white' }}>
                                {key}
                            </h3>
                        );
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
    }, [id, reqPubkey]);

    const hanldeConfirm = async () => {
        let encUserData: UserData | null = null;
        let encArweaveData: ArweaveData | null = null;
        const rpcConn = new Connection(clusterApiUrl('devnet'));

        if (wallet?.publicKey) {
            const toastId = toast.loading('Approving request..');
            const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync(
                [Buffer.from('dig_identity'), wallet?.publicKey.toBuffer()],
                sdk.PROGRAM_ID
            );
            try {
                const acc = await sdk.DigitalIdentity.fromAccountAddress(rpcConn, digitalPdaAcc);
                const response = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: acc,
                    ticker: 'solData',
                });

                const decryptedData = response.data.decryptedData as UserData;

                console.log('requestedData:', decryptedData);
                const updatedDecryptedData: UserData = {
                    name: requestedData.name ? decryptedData.name : 'noaccess',
                    dob: requestedData.dob ? decryptedData.dob : 'noaccess',
                    aadharNumber: requestedData.aadharNum ? decryptedData.aadharNumber : 'noaccess',
                    panNumber: requestedData.panNum ? decryptedData.panNumber : 'noaccess',
                    passportId: requestedData.passportNum ? decryptedData.passportId : 'noaccess',
                    residenceAddress: requestedData.address ? decryptedData.residenceAddress : 'noaccess',
                    contactNumber: requestedData.contactNum ? decryptedData.contactNumber : 'noaccess',
                };

                encUserData = (
                    await axios.post('http://localhost:9000/cryptography/encryptDataWithPubkey', {
                        plainData: updatedDecryptedData as UserData,
                        ticker: 'solData',
                        pubkey: rsaPubkey512,
                    })
                ).data.encryptedData as UserData;
            } catch (e) {
                console.log(e);
                toast.dismiss(toastId);
                toast.error('Error in fetching digital identity account cannot approve this request');
            }

            try {
                const [digitalProofsPda] = PublicKey.findProgramAddressSync(
                    [Buffer.from('dig_proof'), digitalPdaAcc.toBuffer()],
                    digitalIdentity.PROGRAM_ID
                );
                const digitalProofsAcc = await digitalIdentity.DigitalProofs.fromAccountAddress(
                    rpcConn,
                    digitalProofsPda
                );

                const arweaveData: ArweaveData = {
                    panUploadLink: digitalProofsAcc.panUpload,
                    passportUploadLink: digitalProofsAcc.passportUpload,
                    aadharUploadLink: digitalProofsAcc.aadharUpload,
                    picUploadLink: digitalProofsAcc.pictureUpload,
                };

                const response = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: arweaveData as ArweaveData,
                    ticker: 'arweaveData',
                });
                const decryptedData = response.data.decryptedData;
                const updatedDecryptedData: ArweaveData = {
                    panUploadLink: requestedData.panUploadLink ? decryptedData.panUploadLink : 'noaccess',
                    passportUploadLink: requestedData.passportUploadLink
                        ? decryptedData.passportUploadLink
                        : 'noaccess',
                    aadharUploadLink: requestedData.aadharUploadLink ? decryptedData.aadharUploadLink : 'noaccess',
                    picUploadLink: requestedData.picUploadLink ? decryptedData.picUploadLink : 'noaccess',
                };
                encArweaveData = (
                    await axios.post('http://localhost:9000/cryptography/encryptDataWithPubkey', {
                        plainData: updatedDecryptedData as ArweaveData,
                        ticker: 'arweaveData',
                        pubkey: rsaPubkey1028,
                    })
                ).data.encryptedData as ArweaveData;
            } catch (e) {
                console.error(e);
                toast.dismiss(toastId);
                toast.error('Error in fetching digital proofs account cannot approve this request');
            }

            if (encArweaveData && encUserData) {
                try {
                    const res = await axios.post('http://localhost:9000/requests/approve', {
                        requestId: id,
                        encUserData: encUserData,
                        encArweaveData: encArweaveData,
                    });

                    console.log(res.data);
                    if (res.data.status) {
                        toast.dismiss(toastId);
                        toast.success('Request approved');
                        setRefresh(!refresh);
                    } else {
                        toast.dismiss(toastId);
                        toast.error('Error in approving request');
                    }
                } catch (e) {
                    console.error(e);
                    toast.dismiss(toastId);
                    toast.error('Error in approving request');
                }
            }
        }
        setOpen(false);
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
                <Box style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                    <h2 style={{ color: 'white', marginLeft: '3vw' }}>
                        <span style={{ color: 'lightskyblue' }}>Requester Name:</span> {name}
                    </h2>
                    <h2 style={{ color: 'white', marginLeft: '3vw' }}>
                        <span style={{ color: 'lightskyblue' }}>Description:</span> {(data as any).description}
                    </h2>
                    <h2 style={{ color: 'white', marginRight: '3vw' }}>
                        <span style={{ color: 'lightskyblue' }}>Pubkey:</span> {reduceString(solpubkey, 10)}
                    </h2>
                </Box>
                <Box style={{ textAlign: 'center' }}>
                    <h1 style={{ color: 'white', fontWeight: 'bolder' }}>Requested Data</h1>
                </Box>
                <Box>
                    <DisplayKeyValuePairs data={data} />
                </Box>
                <Box style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <button className="balance-button w3-btn w3-hover-white" onClick={hanldeConfirm}>
                        Confirm
                    </button>
                </Box>
            </Box>
        </Modal>
    );
}

export default ResponseModal;
