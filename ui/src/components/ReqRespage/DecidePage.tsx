import './pagestyle.css';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Table } from 'react-bootstrap';
import { useWallet } from "@solana/wallet-adapter-react";
import data from "./MOCK_DATA.json"
import { Button } from '@material-ui/core';
import { useState } from 'react';


interface Data {
    name: string;
    pubkey: string;
    Req: boolean;
    Response: boolean;
}


function DecidePage() {
    const wallet = useWallet();
    const [value, setValue] = useState('')
    const [valueRes, setValueRes] = useState('')
    const [dataSource, setDataSource] = useState<Data[]>(data)
    const [tableFilter, setTableFilter] = useState<Data[]>([]);
    const [tableFilterRes, setTableFilterRes] = useState<Data[]>([]);
    const [reqData, setReqData] = useState<Data[]>([]);
    const [resData, setResData] = useState<Data[]>([]);


    useEffect(() => {
        dataSource.map((item) => {
            if (item.Req) {
                setReqData((prevReqData) => [...prevReqData, item]);
            }
            if (item.Response) {
                setResData((prevResData) => [...prevResData, item]);
            }
        })
    }, []);



    const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value != "") {
            setValue(e.target.value)
            const filterTable = reqData.filter(o => Object.keys(o).some((k) => String(o[k as keyof Data]).toLowerCase().includes(e.target.value.toLowerCase())));
            setTableFilter([...filterTable])
        } else {
            setValue(e.target.value);
            setReqData([...reqData])
        }
    }

    const filterDataRes = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value != "") {
            setValue(e.target.value)
            const filterTableRes = resData.filter(o => Object.keys(o).some((k) => String(o[k as keyof Data]).toLowerCase().includes(e.target.value.toLowerCase())));
            setTableFilterRes([...filterTableRes])
        } else {
            setValue(e.target.value);
            setResData([...resData])
        }
    }

    function AllUsersData() {
        return (<tbody>
            {
                value.length > 0 ? tableFilter.map((item, index) => (
                    <tr style={{ width: "100vw" }} key={index}>
                        <td>{item.name}</td>
                        <td>{item.pubkey}</td>
                        <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Request</Button></td>
                    </tr>
                ))
                    :
                    reqData.map((item, index) => (
                        <tr style={{ width: "100vw" }} key={index}>
                            <td>{item.name}</td>
                            <td>{item.pubkey}</td>
                            <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Request</Button></td>
                        </tr>
                    ))
            }
        </tbody>
        )
    }

    function AllUsersDataRes() {
        return (<tbody>
            {
                value.length > 0 ? tableFilterRes.map((item, index) => (
                    <tr style={{ width: "100vw" }} key={index}>
                        <td>{item.name}</td>
                        <td>{item.pubkey}</td>
                        <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Request</Button></td>
                    </tr>
                ))
                    :
                    dataSource.map((item, index) => (item.Response &&
                        <tr style={{ width: "100vw" }} key={index}>
                            <td>{item.name}</td>
                            <td>{item.pubkey}</td>
                            <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Request</Button></td>
                        </tr>
                    ))
            }
        </tbody>
        )
    }


    return (
        <>
            {wallet.connected ? (
                <>
                    <>
                        <div className="w3-animate-opacity App" style={{ marginTop: "10vh", width: "100vw", display: "flex", flexDirection: "row", justifyContent: 'space-around' }} >
                            <h1 >
                                <b>Requests</b>
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
                        </div>
                        <Table style={{ width: "90vw", height: "auto", color: "white", fontWeight: "bolder", marginTop: "2vh", zIndex: "500", marginLeft: "5vw" }}>
                            <thead>
                                <tr style={{ width: "100%" }}>
                                    <td>Name</td>
                                    <td>Pub key</td>
                                    <td>button</td>
                                </tr>
                            </thead>
                            <AllUsersData></AllUsersData>

                        </Table>
                    </>
                    <>
                        <div className="w3-animate-opacity App" style={{ marginTop: "10vh", width: "100vw", display: "flex", flexDirection: "row", justifyContent: 'space-around' }} >
                            <h1 >
                                <b>Responses</b>
                            </h1>
                            <input
                                type="text"
                                placeholder="Search by name"
                                value={valueRes}
                                onChange={filterDataRes}
                                style={{
                                    padding: '8px',
                                    border: '1px solid #ccc',
                                    borderRadius: '4px',
                                    marginBottom: '16px',
                                    width: '25vw',
                                }}
                            />
                        </div>
                        <Table style={{ width: "90vw", height: "auto", color: "white", fontWeight: "bolder", marginTop: "2vh", zIndex: "500", marginLeft: "5vw" }}>
                            <thead>
                                <tr style={{ width: "100%" }}>
                                    <td>Name</td>
                                    <td>Pub key</td>
                                    <td>button</td>
                                </tr>
                            </thead>
                            <AllUsersDataRes></AllUsersDataRes>

                        </Table>
                    </>
                </>
            ) :
                <Box className="w3-animate-opacity App" sx={{ marginTop: "20vh", width: "100vw" }} >
                    <h1 >
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>}

        </>
    )
}

export default DecidePage