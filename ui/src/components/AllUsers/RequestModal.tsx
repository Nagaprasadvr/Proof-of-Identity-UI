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
import "./reqmodalstyle.css"
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    requestedPubkey: string;
}

function RequestModal({ open, setOpen, requestedPubkey }: Props) {
    const wallet = useWallet();
    const [formData, setFormData] = useState({
        senderName: '',
        name: false,
        dob: false,
        aadharUploadLink: false,
        aadharNumber: false,
        panUploadLink: false,
        panNumber: false,
        passportUploadLink: false,
        passportNumber: false,
        picUploadLink: false,
        address: false,
        description: '',
    })

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
        const res = await axios.post('http://localhost:9000/requests/send', { senderName: formData.senderName, userPubkey: wallet.publicKey?.toBase58(), requestedSolPubkey: requestedPubkey, rsaPubkey: "llllll", requestData: formData })
        console.log("res:", res)
        // console.log(formData);
        setTimeout(() => {
            handleClose();
        }, 1000);
    };


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black", overflow: "scroll" }}>
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Box style={{ backgroundColor: "black" }}>
                    <button style={{ backgroundColor: "transparent", borderColor: "transparent", color: "lightskyblue" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
                </Box>
                <Box style={{ display: 'flex', color: "White", fontWeight: "bolder", fontSize: "25px", width: "100vw", justifyContent: "center" }}>
                    <form onSubmit={handleSubmit} style={{
                        color: "white", fontWeight: "bolder", fontSize: "25px", alignContent: "center", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"
                    }}>
                        <Box>
                            <Table style={{ marginTop: "5vh" }}>
                                <tbody>
                                    <tr>
                                        <td><input type='text' name="senderName" value={formData.senderName} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Your Name</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="name" checked={formData.name} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Name</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="dob" checked={formData.dob} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>DOB</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="panNumber" checked={formData.panNumber} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Pan Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="passportNumber" checked={formData.passportNumber} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Passport Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="aadharNumber" checked={formData.aadharNumber} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Aadhar Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="panUploadLink" checked={formData.panUploadLink} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Pan</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="passportUploadLink" checked={formData.passportUploadLink} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Passport</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="aadharUploadLink" checked={formData.aadharUploadLink} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Aadhar</label></td>
                                    </tr>

                                    <tr>
                                        <td><input type='checkbox' name="picUploadLink" checked={formData.picUploadLink} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>pic</label></td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            <textarea
                                                name='description'
                                                value={formData.description}
                                                style={{ marginLeft: "2vw", marginRight: "2vw", color: "black" }}
                                                onChange={handleChange}
                                            ></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Box>
                        <button style={{ width: "auto", marginTop: "10px" }} className="balance-button w3-btn w3-hover-white App " onClick={handleSubmit}>
                            Submit Request
                        </button>
                    </form>
                </Box>
            </Box>
            {/* Your modal content goes here */}
        </Modal>
    );
}

export default RequestModal;
