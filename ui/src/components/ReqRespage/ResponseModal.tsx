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
 
 
import axios from 'axios';
import { useWallet } from '@solana/wallet-adapter-react';
import { toast } from 'react-hot-toast';
import { Data } from 'node-rsa';

interface Props {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
    name: string;
}

function ResponseModal({ open, setOpen, id, name}: Props) {
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

    interface reqprops {
        data: Record<string, any> | undefined;
    }

    const [reqData, setReqData] = useState<reqprops>()
    
    function DisplayKeyValuePairs({ data }: reqprops) {
        if (!data) {
            return null; // or any other handling for undefined data
        }

        const entries = Object.entries(data);

        return (
            <div>
                {entries.map(([key, value]) => {
                    const isTrue = Boolean(value);
                    
                    if (isTrue && key != "_id" && key != "createdAt" && key != "updatedAt" && key != "rsaPubkey" && key != "requestedSolPubkey" && key != "solPubkey" && key != "senderName") { 
                        return (
                            <p key={key}>
                                {key} 
                                
                            </p>
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
                const response = await axios.post("http://localhost:9000/response/get",{id: id});
                // console.log(response.data)
                setReqData(response.data.data);
                console.log(reqData)
            } catch (err) {
                console.error(err)
            }
        }
        fetchData();
    }, [reqData]);

    

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


    const handleClose = () => {
        setOpen(false);
    };

    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black", overflow: "scroll" }}>
            <Box style={{ width: "100vw", height: "100vh" }}>
                <Box style={{ backgroundColor: "black" }}>
                    <button style={{ backgroundColor: "transparent", borderColor: "transparent", color: "lightskyblue" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
                </Box>
                <Box ><h2>Requester Name: {name}</h2></Box>
                <Box style={{ textAlign: 'center' }}><h2>Requested Data</h2></Box>
                <Box >
                    
                    <DisplayKeyValuePairs data={reqData} />
                    
                </Box>
            </Box>
            {/* Your modal content goes here */}
        </Modal>
    );
}

export default ResponseModal;
