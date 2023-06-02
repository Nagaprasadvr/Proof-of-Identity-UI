import React from 'react'
import { Box } from '@mui/material';
import { Table } from 'react-bootstrap';
import "./alluser.css";
import { useWallet } from "@solana/wallet-adapter-react";
import data from "./MOCK_DATA.json"
import { Button } from '@material-ui/core';
import { useState } from 'react';
import RequestModal from './RequestModal';


interface Data {
    name: string;
    pubkey: string;
}




const Allusers = () => {
    const wallet = useWallet();
    const [tableData, setTableData] = useState(data);
    const [value, setValue] = useState('')
    const [dataSource, setDataSource] = useState<Data[]>(data)
    const [tableFilter, setTableFilter] = useState<Data[]>([]);
    const [open, setOpen] = useState(false);

    const modalOpener = () => {

        setOpen(true)
    }

    const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== "") {
            setValue(e.target.value)
            const filterTable = dataSource.filter(o => Object.keys(o).some((k) => String(o[k as keyof Data]).toLowerCase().includes(e.target.value.toLowerCase())));
            setTableFilter([...filterTable])
        } else {
            setValue(e.target.value);
            setDataSource([...dataSource])
        }
    }

    function AllUsersData() {
        return (<tbody>
            {
                value.length > 0 ? tableFilter.map((item, index) => (
                    <tr style={{ width: "100vw" }} key={index}>
                        <td style={{ textAlign: "center" }}>{index + 1}</td>
                        <td>{item.name}</td>
                        <td>{item.pubkey}</td>
                        <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }} onClick={modalOpener}>Request</Button></td>
                    </tr>
                ))
                    :
                    dataSource.map((item, index) => (
                        <tr style={{ width: "100vw" }} key={index}>
                            <td style={{ textAlign: "center" }}>{index + 1}</td>
                            <td>{item.name}</td>
                            <td>{item.pubkey}</td>
                            <td><button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }} onClick={modalOpener}>Request</button></td>
                        </tr>
                    ))
            }
        </tbody>
        )
    }
    console.log(open)
    return (
        <>
            {wallet.connected ? (
                open === false ?
                    (
                        <>
                            <Box>


                                <Box className="w3-animate-opacity App" style={{ marginTop: "10vh", width: "100vw", display: "flex", flexDirection: "row", justifyContent: 'space-around' }} >
                                    <h1 >
                                        <b>ALL USERS</b>
                                    </h1>
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={value}
                                        onChange={filterData}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            marginBottom: '16px',
                                            width: '25vw',
                                        }}
                                    />
                                </Box>
                                <Table style={{ width: "90vw", height: "auto", color: "white", fontWeight: "bolder", marginTop: "2vh", zIndex: "500", marginLeft: "5vw" }}>
                                    <thead>
                                        <tr style={{ width: "100%" }}>
                                            <td style={{ textAlign: "center" }}>SL.NO</td>
                                            <td>Name</td>
                                            <td>Pub key</td>
                                            <td>button</td>
                                        </tr>
                                    </thead>
                                    <AllUsersData></AllUsersData>

                                </Table>
                            </Box>
                        </>) : (
                        <Box>
                            <RequestModal open={open} setOpen={setOpen} />
                        </Box>

                    )


            ) :
                <Box className="w3-animate-opacity App" sx={{ marginTop: "20vh", width: "100vw" }} >
                    <h1 >
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>}
            {open && (<RequestModal open={open} setOpen={setOpen} ></RequestModal>)}




        </>

    )
}

export default Allusers

