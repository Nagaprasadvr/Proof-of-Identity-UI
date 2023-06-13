import './pagestyle.css';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Table } from 'react-bootstrap';
import { useWallet } from "@solana/wallet-adapter-react";
import data from "./MOCK_DATA.json"
import { Button } from '@material-ui/core';
import { useState } from 'react';
import axios from 'axios';


interface Data {
    _id: string;
    solPubkey: string;
    rsaPubkey: string;
    requestedSolPubkey: string;
    senderName: string;
    name: boolean;
    dob: boolean;
    aadharNum: boolean;
    panNum: boolean;
    passportNum: boolean;
    panUploadLink: boolean;
    passportUploadLink: boolean;
    aadharUploadLink: boolean;
    picUploadLink: boolean;
    description: string;
    address: boolean;
}


function DecidePage() {
    const wallet = useWallet();
    const [value, setValue] = useState('')
    const [valueRes, setValueRes] = useState('')
    const [dataSource, setDataSource] = useState<Data[]>([])
    const [tableFilter, setTableFilter] = useState<Data[]>([]);
    const [tableFilterRes, setTableFilterRes] = useState<Data[]>([]);
    const [reqData, setReqData] = useState<Data[]>([]);
    const [resData, setResData] = useState<Data[]>([]);
     

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://localhost:9000/requests/get");
                // console.log(response.data)
                const userData: Data[] = [];
                // eslint-disable-next-line array-callback-return
                response.data.map((data: Data) => {
                    const _id =  data._id
                    const solPubkey = data.solPubkey
                    const rsaPubkey = data.rsaPubkey
                    const requestedSolPubkey = data.requestedSolPubkey
                    const senderName = data.senderName
                    const name =  data.name
                    const dob =  data.dob
                    const aadharNum =  data.aadharNum
                    const panNum =  data.panNum
                    const passportNum = data.passportNum
                    const panUploadLink =  data.panUploadLink
                    const passportUploadLink =  data.passportUploadLink
                    const aadharUploadLink =  data.aadharUploadLink
                    const picUploadLink =  data.picUploadLink
                    const description =  data.description
                    const address = data.address
                    if (data.requestedSolPubkey === wallet.publicKey?.toString()) {
                        userData.push({ _id, solPubkey, rsaPubkey, requestedSolPubkey, senderName, name, dob, aadharNum, panNum, passportNum, panUploadLink, aadharUploadLink, passportUploadLink, picUploadLink, description, address })
                    }
                })
                // console.log("userData" + userData)
                setDataSource(userData)
                console.log("dataSource"+ dataSource)
            } catch (err) {
                console.error(err)
            }
        }
        fetchData();
    }, [dataSource])
 
    const filterDataRes = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value != "") {
            setValueRes(e.target.value)
            const filterTableRes = dataSource.filter(o => Object.keys(o).some((k) => String(o[k as keyof Data]).toLowerCase().includes(e.target.value.toLowerCase())));
            setTableFilterRes([...filterTableRes])
        } else {
            setValueRes(e.target.value);
            setResData([...resData])
        }
    }

 

 

    function AllUsersDataRes() {
        const DenyRequest = (props: string) => {
            console.log(props);
            const url = "http://localhost:9000/response/" + props
            console.log(url);
            axios.delete(url)
                .then((res) => {
                    console.log("the data has been successfully deleted");
                }).catch((error) => console.log(error));
        }

        return (<tbody>
            {
                value.length > 0 ? tableFilterRes.map((item, index) => (
                    <tr style={{ width: "100vw" }} key={index}>
                        <td>{item.senderName}</td>
                        <td>{item.solPubkey}</td>
                        <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Request</Button></td>
                        <td><Button style={{ color: "white", backgroundColor: "red", borderRadius: "5px" }} onClick={() => DenyRequest(item._id)}>Deny</Button></td>

                    </tr>
                ))
                    : 
                    dataSource.map((item, index) => (
                        // (item.requestedSolPubkey == wallet.publicKey?.toString() && (
                            < tr style={{ width: "100vw" }} key={index}>
                                <td>{item.senderName}</td>
                                <td>{item.solPubkey}</td>
                                <td><Button style={{ color: "white", backgroundColor: "lightskyblue", borderRadius: "5px" }}>Accept</Button></td>
                                <td><Button style={{ color: "white", backgroundColor: "red", borderRadius: "5px" }} onClick={() => DenyRequest(item._id)}>Deny</Button></td>
                            </tr>
                            // ))
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
                        {dataSource.length > 0 ?(
                            <Table style={{ width: "90vw", height: "auto", color: "white", fontWeight: "bolder", marginTop: "2vh", zIndex: "500", marginLeft: "5vw" }}>
                                <thead>
                                    <tr style={{ width: "100%" }}>
                                        <td>Name</td>
                                        <td>Pub key</td>
                                        <td>button</td>
                                        <td>button</td>
                                    </tr>
                                </thead>
                                <AllUsersDataRes></AllUsersDataRes>
                            </Table>):(<></>)
}
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