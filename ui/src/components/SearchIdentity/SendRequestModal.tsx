import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import Box from '@material-ui/core/Box';
import CancelIcon from '@mui/icons-material/Cancel';
import { Modal } from '@material-ui/core';
import { Table } from 'react-bootstrap';
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

    const [email, setEmail] = useState(false);
    const [emailVerify, setEmailVerify] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [otpVerified, setOtpVerified] = useState(false);
    const [inputOTP, setInputOTP] = useState<string>('');
    useEffect(() => {}, [email]);

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

    const handleEmailVerification = async () => {
        const id = toast.loading('Sending OTP...');
        try {
            const response = await axios.post('http://localhost:9000/emailVerification/sendOTP', {
                email: emailVerify,
            });
            console.log(response);
            if (response.data.status === true) {
                setOtpSent(true);
                toast.dismiss(id);
                toast.success('OTP sent successfully');
            } else {
                toast.dismiss(id);
                toast.error('Failed to send OTP');
            }
        } catch (err) {
            toast.dismiss(id);
            console.log(err);
            toast.error('Failed to send OTP');
        }
    };

    function handleEmail(event: React.ChangeEvent<HTMLInputElement>) {
        event.preventDefault();
        setEmail(true);
        setEmailVerify(event.target.value);
        const mailId = event.target.value;
        console.log(mailId);
        console.log(email);
    }

    const handleOTPInputChange = (event: any) => {
        setInputOTP(event.target.value);
    };

    const verifyOtp = async () => {
        const id = toast.loading('Verifying OTP...');
        try {
            const response = await axios.post('http://localhost:9000/emailVerification/verifyOTP', {
                email: emailVerify,
                otp: inputOTP,
            });
            console.log(response);
            if (response.data.status === true) {
                setOtpVerified(true);
                toast.dismiss(id);
                toast.success('OTP verified successfully');
            }
        } catch (err) {
            console.log(err);
            toast.error('Failed to verify OTP');
        }
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
                    {!otpVerified && (
                        <Box className="EmailBox">
                            <Box
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: '40px',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}
                            >
                                <label>Email Verification</label>

                                <input
                                    style={{ width: '500px', borderRadius: '10px', height: '60px' }}
                                    type="email"
                                    name="email"
                                    value={emailVerify}
                                    onChange={handleEmail}
                                    placeholder="Enter your email id"
                                ></input>

                                {!otpSent ? (
                                    <button
                                        className="balance-button w3-btn w3-hover-white App"
                                        style={{ width: 'auto', fontWeight: 'bold' }}
                                        onClick={() => {
                                            handleEmailVerification();
                                        }}
                                    >
                                        Generate OTP
                                    </button>
                                ) : (
                                    <Box
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: '10px',
                                            justifyContent: 'center',
                                            alignContent: 'center',
                                        }}
                                    >
                                        <input
                                            placeholder="Enter OTP to verify"
                                            type="text"
                                            onChange={handleOTPInputChange}
                                            value={inputOTP}
                                        ></input>
                                        <button
                                            className="balance-button w3-btn w3-hover-white App"
                                            style={{ width: 'auto', fontWeight: 'bold' }}
                                            onClick={() => {
                                                verifyOtp();
                                            }}
                                        >
                                            Verify OTP
                                        </button>
                                        <p>OTP will expire in 5 mins...</p>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                    )}

                    {/* //Request Form */}
                    {otpVerified ? (
                        <form
                            onSubmit={handleSubmit}
                            style={{
                                color: 'lightskyblue',
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
                                                <label>Your Name</label>
                                            </td>

                                            <td>
                                                <textarea
                                                    name="senderName"
                                                    value={formData.senderName}
                                                    style={{ color: 'black', width: '100%', height: '100%' }}
                                                    onChange={handleChange}
                                                ></textarea>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
                                                    name="name"
                                                    checked={formData.name}
                                                    onChange={handleChange}
                                                    style={{
                                                        marginLeft: '2vw',
                                                        marginRight: '2vw',
                                                    }}
                                                ></input>
                                            </td>
                                            <td>
                                                <label>Name</label>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    border: 'none',
                                                }}
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="container"
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
                                            <td
                                                style={{
                                                    display: 'flex',
                                                    justifyContent: 'center',
                                                    flexDirection: 'row',
                                                    width: '100%',
                                                    border: 'none',
                                                    marginTop: '3vh',
                                                }}
                                            >
                                                Description
                                            </td>
                                            <td>
                                                <textarea
                                                    name="description"
                                                    value={formData.description}
                                                    style={{ color: 'black', width: '100%', height: '100%' }}
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
                    ) : (
                        <></>
                    )}
                </Box>
            </Box>
            {/* Your modal content goes here */}
        </Modal>
    );
}

export default SendRequestModal;
