import { Box } from '@mui/material'
import React, { Dispatch, SetStateAction, useState } from 'react'
import { Modal, Table } from 'react-bootstrap'
import FormLabel from '@mui/material/FormLabel';
import FormControl from '@mui/material/FormControl';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import Checkbox from '@mui/material/Checkbox';
import CancelIcon from '@mui/icons-material/Cancel';

interface Props {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>
}

function RequestModal(props: Props) {
    const { open, setOpen } = props;
    const [state, setState] = React.useState({
        gilad: false,
        jason: false,
        antoine: false,
    });

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            [event.target.name]: event.target.checked,
        });
    };

    const { gilad, jason, antoine } = state;


    const handleClose = () => {
        setOpen(false)
    }

    return (
        <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh", background: "black" }}>
            <Box style={{ backgroundColor: "black" }}>
                <button style={{ backgroundColor: "transparent", borderColor: "transparent", color: "lightskyblue" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button>
            </Box>
            <Box sx={{ display: 'flex' }}>
                <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                    <FormLabel component="legend">Assign responsibility</FormLabel>
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox checked={gilad} onChange={handleChange} name="gilad" />
                            }
                            label="Gilad Gray"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={jason} onChange={handleChange} name="jason" />
                            }
                            label="Jason Killian"
                        />
                        <FormControlLabel
                            control={
                                <Checkbox checked={antoine} onChange={handleChange} name="antoine" />
                            }
                            label="Antoine Llorca"
                        />
                    </FormGroup>
                    <FormHelperText>Be careful</FormHelperText>
                </FormControl>
            </Box>
        </Modal>
    )
}

export default RequestModal