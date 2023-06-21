import './pagestyle.css';
import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Table } from 'react-bootstrap';
import { useWallet } from '@solana/wallet-adapter-react';
import data from './MOCK_DATA.json';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { reduceString } from '../ViewIdentity/helper';
import RequestModal from './ResponseModal';
import ResponseModal from './ResponseModal';

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

function DecidePage({ serverConnected }: { serverConnected: boolean }) {
    const wallet = useWallet();
    const [value, setValue] = useState('');
    const [valueRes, setValueRes] = useState('');
    const [dataSource, setDataSource] = useState<Data[]>([]);
    const [tableFilter, setTableFilter] = useState<Data[]>([]);
    const [tableFilterRes, setTableFilterRes] = useState<Data[]>([]);
    const [reqData, setReqData] = useState<Data[]>([]);
    const [resData, setResData] = useState<Data[]>([]);
    const [refresh, setRefresh] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [id, setId] = useState('');
    const [name, setName] = useState('');
    const [solPub, setSolPub] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/requests/getAll');
                console.log(response)
                const userData: Data[] = [];
                // eslint-disable-next-line array-callback-return
                response.data.map((data: Data) => {
                    const _id = data._id;
                    const solPubkey = data.solPubkey;
                    const rsaPubkey = data.rsaPubkey;
                    const requestedSolPubkey = data.requestedSolPubkey;
                    const senderName = data.senderName;
                    const name = data.name;
                    const dob = data.dob;
                    const aadharNum = data.aadharNum;
                    const panNum = data.panNum;
                    const passportNum = data.passportNum;
                    const panUploadLink = data.panUploadLink;
                    const passportUploadLink = data.passportUploadLink;
                    const aadharUploadLink = data.aadharUploadLink;
                    const picUploadLink = data.picUploadLink;
                    const description = data.description;
                    const address = data.address;
                    if (data.requestedSolPubkey === wallet.publicKey?.toString()) {
                        userData.push({
                            _id,
                            solPubkey,
                            rsaPubkey,
                            requestedSolPubkey,
                            senderName,
                            name,
                            dob,
                            aadharNum,
                            panNum,
                            passportNum,
                            panUploadLink,
                            aadharUploadLink,
                            passportUploadLink,
                            picUploadLink,
                            description,
                            address,
                        });
                    }
                });

                setDataSource(userData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, [wallet.publicKey, refresh]);

    const filterDataRes = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value != '') {
            setValueRes(e.target.value);
            const filterTableRes = dataSource.filter((o) =>
                Object.keys(o).some((k) =>
                    String(o[k as keyof Data])
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                )
            );
            setTableFilterRes([...filterTableRes]);
        } else {
            setValueRes(e.target.value);
            setResData([...resData]);
        }
    };

    const handleRefresh = () => {
        setRefresh(!refresh);

        toast.loading('Refreshing...', { duration: 3000 });
    };

    function AllUsersDataRes() {
        const DenyRequest = (id: string) => {
            try {
                const url = 'http://localhost:9000/requests/deny';
                axios
                    .post(url, { id: id })
                    .then((res) => {
                        console.log('request denied');
                        setRefresh(!refresh);
                        toast.success('Request has been denied');
                    })
                    .catch((error) => console.log(error));
            } catch (e) {
                console.log(e);
            }
        };

        return (
            <tbody>
                {value.length > 0
                    ? tableFilterRes.map((item, index) => (
                          <tr style={{ width: '100vw' }} key={index}>
                              <td>{item.senderName}</td>
                              <td>{reduceString(item.solPubkey, 10)}</td>
                              <td>{item.description}</td>
                              <td>
                                  <button
                                      style={{
                                          width: 'auto',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                          fontWeight: '600',
                                      }}
                                      className="balance-button w3-btn w3-hover-white App "
                                      onClick={() => {
                                          setRefresh(!refresh);
                                          setOpen(true);
                                          setId(item._id);
                                          setName(item.senderName);
                                          setSolPub(item.solPubkey);
                                      }}
                                  >
                                      Accept
                                  </button>

                                  <button
                                      style={{
                                          width: 'auto',
                                          background: 'red',
                                          color: 'white',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                          fontWeight: '600',
                                      }}
                                      className="balance-button w3-btn w3-hover-white App "
                                      onClick={() => {
                                          DenyRequest(item._id);
                                      }}
                                  >
                                      Deny
                                  </button>
                              </td>
                          </tr>
                      ))
                    : dataSource.map((item, index) => (
                          // (item.requestedSolPubkey == wallet.publicKey?.toString() && (
                          <tr style={{ width: '100vw' }} key={index}>
                              <td>{item.senderName}</td>
                              <td>{reduceString(item.solPubkey, 18)}</td>
                              <td>{item.description}</td>
                              <td style={{ display: 'flex', justifyContent: 'space-around' }}>
                                  <button
                                      style={{ width: 'auto', fontWeight: '600' }}
                                      className="balance-button w3-btn w3-hover-white App "
                                      onClick={() => {
                                          setRefresh(!refresh);
                                          setOpen(true);
                                          setId(item._id);
                                          setName(item.senderName);
                                          setSolPub(item.solPubkey)
                                      }}
                                  >
                                      Accept
                                  </button>
                                  <button
                                      style={{
                                          width: 'auto',
                                          background: 'red',
                                          color: 'white',
                                          display: 'flex',
                                          justifyContent: 'space-around',
                                          fontWeight: '600',
                                      }}
                                      className="balance-button w3-btn w3-hover-white App "
                                      onClick={() => {
                                          DenyRequest(item._id);
                                      }}
                                  >
                                      Deny
                                  </button>
                              </td>
                          </tr>
                          // ))
                      ))}
            </tbody>
        );
    }

    return (
        <>
            {serverConnected ? (
                wallet?.connected ? (
                    <>
                        <>
                            <div
                                className="w3-animate-opacity App"
                                style={{
                                    marginTop: '10vh',
                                    width: '100vw',
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-around',
                                }}
                            >
                                <h1>
                                    <b>Incoming Requests</b>
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
                                <button
                                    style={{ width: 'auto' }}
                                    className="balance-button w3-btn w3-hover-white App "
                                    onClick={handleRefresh}
                                >
                                    Refresh
                                </button>
                            </div>
                            {dataSource.length > 0 ? (
                                <Table
                                    style={{
                                        width: '90vw',
                                        height: 'auto',
                                        color: 'white',
                                        fontWeight: 'bolder',
                                        marginTop: '2vh',
                                        zIndex: '500',
                                        marginLeft: '5vw',
                                    }}
                                >
                                    <thead>
                                        <tr style={{ width: '100%' }}>
                                            <td>Name</td>
                                            <td>Pub key</td>
                                            <td>Description</td>
                                            <td style={{ display: 'flex', justifyContent: 'space-around' }}>Action</td>
                                        </tr>
                                    </thead>
                                    <AllUsersDataRes></AllUsersDataRes>
                                </Table>
                            ) : (
                                <></>
                            )}
                            {open && <ResponseModal open={open} setOpen={setOpen} id={id} name={name} pubkey={solPub}></ResponseModal>}
                        </>
                    </>
                ) : (
                    <Box className="w3-animate-opacity App" sx={{ marginTop: '20vh', width: '100vw' }}>
                        <h1>
                            <b>Connect your Wallet!</b>
                        </h1>
                    </Box>
                )
            ) : (
                <Box className="w3-animate-opacity App" sx={{ marginTop: '20vh', width: '100vw' }}>
                    <h1>
                        <b>Protocol Down!</b>
                    </h1>
                </Box>
            )}
        </>
    );
}

export default DecidePage;
