import React, { useEffect } from 'react';
import { Box } from '@mui/material';
import { Table } from 'react-bootstrap';
import './alluser.css';
import { useWallet } from '@solana/wallet-adapter-react';
import data from './MOCK_DATA.json';
import { Button } from '@material-ui/core';
import { useState } from 'react';
import RequestModal from './RequestModal';
import { toast } from 'react-hot-toast';
import { RowingSharp } from '@mui/icons-material';
import { ServerConnectionProps } from '../Home/Home';
import { fetchData } from '@project-serum/anchor/dist/cjs/utils/registry';
import axios from 'axios';
import { publicKey } from '@metaplex-foundation/beet-solana';
import { RSAKepairVariants } from '../../App';

interface Data {
    name: string;
    pubkey: string;
}

interface AllUsersProps {
    connected: boolean;
    rsaKeypairs: RSAKepairVariants;
}

const Allusers = ({ connected, rsaKeypairs }: AllUsersProps) => {
    const [allIdentities, setAllIdentities] = useState<Data[]>([]);
    const wallet = useWallet();
    const [tableData, setTableData] = useState(data);
    const [value, setValue] = useState('');
    const [searchedRows, setSearchedRows] = useState<Data[]>([]);
    const [dataSource, setDataSource] = useState<Data[]>(data);
    const [tableFilter, setTableFilter] = useState<Data[]>([]);
    const [open, setOpen] = useState(false);
    const [pubkey, setPubkey] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:9000/digitalIdentities/get');

                const userData: Data[] = [];
                // eslint-disable-next-line array-callback-return
                response.data.map((data: any) => {
                    const pubkey = data.userPubkey;
                    const name = data.name;
                    userData.push({ pubkey, name });
                });

                setAllIdentities(userData);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const modalOpener = (props: string) => {
        setOpen(true);
        setPubkey(props);
    };

    const filterData = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value !== '') {
            setValue(e.target.value);
            const filterTable = dataSource.filter((o) =>
                Object.keys(o).some((k) =>
                    String(o[k as keyof Data])
                        .toLowerCase()
                        .includes(e.target.value.toLowerCase())
                )
            );
            setTableFilter([...filterTable]);
        } else {
            setValue(e.target.value);
            setDataSource([...dataSource]);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedRows([]);
        if (e.target.value !== '') {
            setValue(e.target.value);
        } else {
            setValue('');
        }
    };
    const onClickSubmit = () => {
        let rows: Data[] = [];
        try {
            allIdentities.forEach((data) => {
                if (data.name.toLowerCase() === value.toLowerCase()) {
                    rows.push(data);
                }
            });

            if (rows.length > 0) {
                setSearchedRows(rows);
            } else {
                setSearchedRows([]);
                toast.error('Searched Name Doesnt exist!');
            }
        } catch (e) {
            toast.error('Searched Name is not associated with any Digital Identity');
        }
    };

    const handleRequest = (item: Data) => {
        if (wallet?.publicKey?.toBase58() === item.pubkey) {
            toast.error('You cannot request to share your own Identity!');
        } else {
            modalOpener(item.pubkey);
        }
    };
    function AllUsersData() {
        return (
            <>
                {searchedRows.length > 0 ? (
                    <tbody>
                        {searchedRows.map((item, index) => {
                            return (
                                <tr style={{ width: '100vw' }} key={index}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td>{item.name}</td>
                                    <td>{item.pubkey}</td>
                                    <td>
                                        {' '}
                                        <button
                                            style={{ width: 'auto' }}
                                            className="balance-button w3-btn w3-hover-white App "
                                            onClick={() => {
                                                handleRequest(item);
                                            }}
                                        >
                                            Request
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                ) : null}
            </>
        );
    }
    return (
        <>
            {connected ? (
                wallet.connected ? (
                    open === false ? (
                        <>
                            <Box>
                                <Box
                                    className="w3-animate-opacity App"
                                    style={{
                                        marginTop: '10vh',
                                        width: '100vw',
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-around',
                                    }}
                                >
                                    <h1 style={{ fontSize: '30px' }}>
                                        <b>Search for Digital Identities</b>
                                    </h1>
                                    <input
                                        type="text"
                                        placeholder="Search by name"
                                        value={value}
                                        onChange={handleInput}
                                        style={{
                                            padding: '8px',
                                            border: '1px solid #ccc',
                                            borderRadius: '4px',
                                            marginBottom: '16px',
                                            width: '25vw',
                                            marginTop: '15px',
                                            fontSize: '20px',
                                            fontWeight: 'bold',
                                        }}
                                    />
                                    <button
                                        style={{ width: 'auto' }}
                                        className="balance-button w3-btn w3-hover-white App "
                                        onClick={onClickSubmit}
                                    >
                                        Search
                                    </button>
                                </Box>
                                {searchedRows.length > 0 ? (
                                    <Table
                                        style={{
                                            width: '90vw',
                                            height: 'auto',
                                            color: 'lightskyblue',
                                            fontWeight: 'bolder',
                                            marginTop: '2vh',
                                            zIndex: '500',
                                            marginLeft: '5vw',
                                            borderRadius: 'rem',
                                        }}
                                    >
                                        <thead style={{ color: 'lightskyblue' }}>
                                            <tr style={{ width: '100%' }}>
                                                <td style={{ textAlign: 'center', color: 'lightskyblue' }}>ID</td>
                                                <td style={{ color: 'lightskyblue' }}>Name</td>
                                                <td style={{ color: 'lightskyblue' }}>Pub key</td>
                                                <td style={{ color: 'lightskyblue' }}>Action</td>
                                            </tr>
                                        </thead>
                                        <AllUsersData></AllUsersData>
                                    </Table>
                                ) : null}
                            </Box>
                        </>
                    ) : (
                        <Box>
                            <RequestModal open={open} setOpen={setOpen} requestedPubkey={pubkey} />
                        </Box>
                    )
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
};

export default Allusers;
