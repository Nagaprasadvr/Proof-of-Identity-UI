import { Dispatch, SetStateAction } from 'react';
import { Modal, Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import { useState, useMemo, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { Table } from 'react-bootstrap';
import { reduceString } from '../ViewIdentity/helper';
import { UserData } from '../InputForm/InputForm';
import './viewstyle.css';
import axios from 'axios';
import { ArweaveData, DataState } from '../ViewIdentity/ViewIdentityModal';
interface OutgoingProps {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    id: string;
}

interface Data {
    [key: string]: string;
    aadharNum: string;
    aadharUploadLink: string;
    contactNum: string;
    dob: string;
    name: string;
    panNum: string;
    panUploadLink: string;
    passportNum: string;
    passportUploadLink: string;
    picUploadLink: string;
    requestId: string;
    residentAddress: string;
}

type CompleteData = ArweaveData & UserData;

function OutgoingRequestModal({ open, setOpen, id }: OutgoingProps) {
    const [refresh, setRefresh] = useState(false);
    const [data, setData] = useState<Data | null>(null);
    const [dataState, setDataState] = useState<DataState>(DataState.Encrypted);
    const [digitalIdentityData, setDigitalIdentityData] = useState<UserData | null>(null);
    const [digitalProofs, setDigitalProofs] = useState<ArweaveData | null>(null);
    const [completeData, setCompleteData] = useState<CompleteData | null>(null);
    console.log(id);

    useEffect(() => {
        const fetch = async () => {
            try {
                const response = await axios.post('http://localhost:9000/requests/getResponseById', { id: id });
                console.log('loggg: ' + response.data[0]);
                console.log('response: ', response);
                const responseData: Data = {
                    aadharNum: response.data[0].aadharNum,
                    aadharUploadLink: response.data[0].aadharUploadLink,
                    contactNum: response.data[0].contactNum,
                    dob: response.data[0].dob,
                    name: response.data[0].name,
                    panNum: response.data[0].panNum,
                    panUploadLink: response.data[0].panUploadLink,
                    passportNum: response.data[0].passportNum,
                    passportUploadLink: response.data[0].passportUploadLink,
                    picUploadLink: response.data[0].picUploadLink,
                    requestId: response.data[0].requestId,
                    residentAddress: response.data[0].residenceAddress,
                };
                console.log('response: ', responseData);

                setData(responseData);
            } catch (err) {
                console.error(err);
            }
        };

        fetch();
    }, [id, refresh]);

    const handleDecryptEncryptData = useCallback(async () => {
        toast.loading(dataState === DataState.Encrypted ? 'Decrypting..' : 'Encrypting...', { duration: 800 });

        const userData: UserData = {
            aadharNumber: (data as Data).aadharNum,
            contactNumber: (data as Data).contactNum,
            dob: (data as Data).dob,
            name: (data as Data).name,
            panNumber: (data as Data).panNum,
            residenceAddress: (data as Data).residentAddress,
            passportId: (data as Data).passportNum,
        };
        console.log('user Data:', userData);
        const arweaveData: ArweaveData = {
            panUploadLink: (data as Data).panUploadLink,
            aadharUploadLink: (data as Data).aadharUploadLink,
            passportUploadLink: (data as Data).passportUploadLink,
            picUploadLink: (data as Data).picUploadLink,
        };
        if (dataState === DataState.Encrypted) {
            console.log('enc');
            try {
                console.log('user data', userData);
                console.log('arweave data', arweaveData);
                const response1 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: userData as UserData,
                    ticker: 'solData',
                });
                console.log('res:', response1.data);

                const response2 = await axios.post('http://localhost:9000/cryptography/decryptData', {
                    encData: arweaveData as ArweaveData,
                    ticker: 'arweaveData',
                });
                console.log('res:', response2.data);
                setDataState(DataState.Decrypted);
                console.log('dec:', response1.data);
                setDigitalIdentityData(response1.data.decryptedData);
                setDigitalProofs(response2.data.decryptedData);
                if (response1.data.decryptedData && response2.data.decryptedData) {
                    setCompleteData({ ...response1.data.decryptedData, ...response2.data.decryptedData });
                }
            } catch (e) {
                toast.error('failed to Decrypt data');
            }
        } else if (dataState === DataState.Decrypted) {
            setDigitalIdentityData(userData);
            setDigitalProofs(arweaveData);
            setDataState(DataState.Encrypted);
        }
    }, [data, dataState]);

    const handleRefresh = () => {
        toast.loading('Refreshing data', { duration: 2000 });
        setRefresh(!refresh);
    };

    const renderModal = useMemo(() => {
        console.log('DataState', dataState === DataState.Encrypted ? 'Encrypted' : 'Decrypted');
        console.log('data', data);
        return (
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                style={{ width: '100vw', height: '100vh', background: 'black' }}
                sx={{ overflow: 'auto' }}
            >
                <Box>
                    <Box style={{ backgroundColor: 'black' }}>
                        <button
                            style={{
                                backgroundColor: 'transparent',
                                borderColor: 'transparent',
                                color: 'lightskyblue',
                            }}
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CancelIcon style={{ color: 'lightskyblue', fontSize: '50px' }}></CancelIcon>
                        </button>
                    </Box>
                    <Box
                        style={{
                            width: 'auto',
                            marginBottom: '2vh',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}
                        sx={{ gap: '30px' }}
                    >
                        <button
                            className="centered-button balance-button w3-btn w3-hover-white App"
                            style={{ width: 'auto' }}
                            type="submit"
                            onClick={handleRefresh}
                        >
                            Refresh
                        </button>
                        <button
                            className="centered-button balance-button w3-btn w3-hover-white App"
                            style={{ width: 'auto' }}
                            type="submit"
                            onClick={handleDecryptEncryptData}
                        >
                            {dataState === DataState.Encrypted ? 'Decrypt Data' : 'Encrypt Data'}
                        </button>
                    </Box>

                    <Table
                        style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignContent: 'center',
                            alignItems: 'center',
                            marginTop: '10vh',
                        }}
                        hover
                    >
                        <tbody>
                            {dataState === DataState.Encrypted
                                ? data &&
                                  Object.keys(data as Data).map((key) => (
                                      <tr key={key} style={{ color: 'black', background: '#afaae9' }}>
                                          <td style={{ color: 'black', width: '30vw', fontWeight: 'bold' }}>{key}</td>
                                          <td
                                              style={{
                                                  color: 'black',
                                                  paddingLeft: '2vw',
                                                  width: '30vw',
                                                  fontWeight: 'bold',
                                              }}
                                          >
                                              {reduceString(data[key], 10)}
                                          </td>
                                      </tr>
                                  ))
                                : completeData &&
                                  Object.keys(completeData as CompleteData).map((key) => (
                                      <tr key={key} style={{ color: 'black', background: '#afaae9' }}>
                                          <td style={{ color: 'black', width: '30vw', fontWeight: 'bold' }}>{key}</td>
                                          <td
                                              style={{
                                                  color: 'black',
                                                  paddingLeft: '2vw',
                                                  width: '30vw',
                                                  fontWeight: 'bold',
                                              }}
                                          >
                                              {key.includes('Link') && completeData[key] !== 'noaccess'
                                                  ? `https://arweave.net/${completeData[key]}`
                                                  : completeData[key]}
                                          </td>
                                      </tr>
                                  ))}
                        </tbody>
                    </Table>
                </Box>
            </Modal>
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, dataState, digitalIdentityData, open, refresh, handleDecryptEncryptData, setOpen]);
    return <>{renderModal}</>;
}

export default OutgoingRequestModal;
