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

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}

function RequestModal({ open, setOpen }: Props) {
    const [formData, setFormData] = useState({
        name: false,
        pubkey: false,
        dob: false,
        aadhar: false,
        aadharnumber: false,
        pan: false,
        panNumber: false,
        passport: false,
        passportNum: false,
        pic: false,
        textAreaValue: ''
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

    const handleSubmit = (event: any) => {
        event.preventDefault();
        // Perform form submission logic here
        axios.post('/Allusers', formData)
            .then(response => {
                // Handle successful response
            })
            .catch(error => {
                console.error(error);
                // Handle error
            });
        console.log(formData);
    };


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black" }}>
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
                                        <td><input type='checkbox' name="name" checked={formData.name} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Name</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="dob" checked={formData.dob} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>DOB</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="panNumber" checked={formData.panNumber} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Pan Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="passportNum" checked={formData.passportNum} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Passport Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="aadharnumber" checked={formData.aadharnumber} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Aadhar Number</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="pan" checked={formData.pan} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Pan</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="passport" checked={formData.passport} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Passport</label></td>
                                    </tr>
                                    <tr>
                                        <td><input type='checkbox' name="aadhar" checked={formData.aadhar} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>Aadhar</label></td>
                                    </tr>

                                    <tr>
                                        <td><input type='checkbox' name="pic" checked={formData.pic} onChange={handleChange} style={{ marginLeft: "2vw", marginRight: "2vw" }}></input></td><td><label>pic</label></td>
                                    </tr>
                                    <tr>
                                        <td>Description</td>
                                        <td>
                                            <textarea
                                                name='textAreaValue'
                                                value={formData.textAreaValue}
                                                style={{ color: "white", fontSize: "10px", fontWeight: "medium", width: "100%", height: "100%" }}
                                                onChange={handleChange}
                                            ></textarea>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Box>
                        <button style={{ width: "auto", marginTop: "10px" }} className="balance-button w3-btn w3-hover-white App " onClick={handleClose}>
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
