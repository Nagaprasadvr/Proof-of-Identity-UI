import React, { Dispatch, SetStateAction, useState } from 'react';
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
import './searchIdentity.css';
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    requestedPubkey: string;
    receiverName: string;
}

export interface RSAKeyPair {
    pubKey: string;
    privateKey: string;
}
function SendRequestModal({ open, setOpen, requestedPubkey, receiverName }: Props) {
    const wallet = useWallet();
    const [formData, setFormData] = useState({
        senderName: '',
        name: false,
        dob: false,
        contactNum: false,
        aadharUploadLink: false,
        aadharNumber: false,
        panUploadLink: false,
        panNumber: false,
        passportUploadLink: false,
        passportNumber: false,
        picUploadLink: false,
        address: false,
        description: '',
    });

    const handleChange = (event: any) => {
        if (event.target.type === 'checkbox') {
            setFormData({
                ...formData,
                [event.target.name]: event.target.checked ? 'true' : 'false',
            });
        } else {
            setFormData({
                ...formData,
                [event.target.name]: event.target.value,
            });
        }
    };

    const handleSubmit = async (event: any) => {
        event.preventDefault();
        // Perform form submission logic here
        try {
            const response = await axios.get('http://localhost:9000/cryptography/getRSAKeypair');
            if (response.data.status === true) {
                const keypair_512: RSAKeyPair = response.data.keypair_512;
                const keypair_1028: RSAKeyPair = response.data.keypair_1028;
                const pubkey_1028 = keypair_1028.pubKey;
                const pubkey_512 = keypair_512.pubKey;
                await axios.post('http://localhost:9000/requests/send', {
                    senderName: formData.senderName,
                    receiverName: receiverName,
                    userPubkey: wallet.publicKey?.toBase58(),
                    requestedSolPubkey: requestedPubkey,
                    rsaPubkey512: pubkey_512,
                    rsaPubkey1028: pubkey_1028,
                    requestData: formData,
                });
                toast.success('Request sent successfully');
                setTimeout(() => {
                    handleClose();
                }, 2500);
            }
        } catch (e) {
            toast.error('failed to send');
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
                <Box
                    style={{
                        display: 'flex',
                        color: 'White',
                        fontWeight: 'bolder',
                        fontSize: '25px',
                        width: '100vw',
                        justifyContent: 'center',
                    }}
                >
                    <form
                        onSubmit={handleSubmit}
                        style={{
                            color: 'white',
                            fontWeight: 'bolder',
                            fontSize: '25px',
                            alignContent: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <Box>
                            <Table style={{ marginTop: '5vh' }}>
                                <tbody>
                                    <tr>
                                        <td>
                                            <input
                                                type="text"
                                                name="senderName"
                                                value={formData.senderName}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Your Name</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="name"
                                                checked={formData.name}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Name</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="dob"
                                                checked={formData.dob}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>DOB</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="contactNum"
                                                checked={formData.contactNum}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Contact Number</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="address"
                                                checked={formData.address}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Residence Address</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="panNumber"
                                                checked={formData.panNumber}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Pan Number</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="passportNumber"
                                                checked={formData.passportNumber}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Passport Number</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="aadharNumber"
                                                checked={formData.aadharNumber}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Aadhar Number</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="panUploadLink"
                                                checked={formData.panUploadLink}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Pan Link</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="passportUploadLink"
                                                checked={formData.passportUploadLink}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Passport Link</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="aadharUploadLink"
                                                checked={formData.aadharUploadLink}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>Aadhar Link</label>
                                        </td>
                                    </tr>

                                    <tr>
                                        <td>
                                            <input
                                                type="checkbox"
                                                name="picUploadLink"
                                                checked={formData.picUploadLink}
                                                onChange={handleChange}
                                                style={{ marginLeft: '2vw', marginRight: '2vw' }}
                                            ></input>
                                        </td>
                                        <td>
                                            <label>pic Link</label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                style={{ marginLeft: '2vw', marginRight: '2vw', color: 'black' }}
                                                onChange={handleChange}
                                            ></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Box>
                        <button
                            style={{ width: 'auto', marginTop: '10px' }}
                            className="balance-button w3-btn w3-hover-white App "
                            onClick={handleSubmit}
                        >
                            Submit Request
                        </button>
                    </form>
                </Box>
            </Box>
            {/* Your modal content goes here */}
        </Modal>
    );
}

export default SendRequestModal;
