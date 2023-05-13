import React from 'react';
import { InputForm } from '../InputForm/InputForm';
import '../../App.css';
import * as Web3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box } from '@mui/material';
import { closeSnackbar, enqueueSnackbar } from 'notistack';
export const Home = () => {
    const rpc = new Web3.Connection(Web3.clusterApiUrl('devnet'));

    const { publicKey, wallet } = useWallet();

    const airdropSol = async () => {
        const id = enqueueSnackbar("Airdrop in progress...", { variant: "info", persist: true })
        try {
            if (publicKey) {

                const sig = await rpc.requestAirdrop(publicKey, Web3.LAMPORTS_PER_SOL * 1);
                await rpc.confirmTransaction(sig);

            }
            closeSnackbar(id);
            enqueueSnackbar("Airdrop Success", { variant: "success", })

        }
        catch (e) {
            closeSnackbar(id);
            console.error(e)
            enqueueSnackbar("Airdrop Failed", { variant: "error" })

        }


    };

    return (
        <Box className="App">
            {publicKey && wallet ? (
                <Box className="App">
                    <h1 className="w3-animate-opacity">
                        <b >Create your Digital fingerprint on Solana chain!</b>
                    </h1>

                    <Box className="w3-animate-opacity w3-jumbo">
                        <i className="fa fa-fingerprint" style={{ color: 'lightskyblue' }}></i>
                    </Box>
                    <Box className="w3-animate-top">
                        <InputForm />
                    </Box>
                    <Box
                        className="w3-animate-opacity"
                        style={{
                            alignContent: 'center',
                            width: '100%',

                            marginTop: '20px',
                            borderRadius: '10px',
                            alignItems: 'center',

                            display: 'flex',
                            justifyContent: 'center',
                            height: '60px',
                        }}
                    >
                        <h2 className='w3-animate-opacity'>
                            <b>Connected to {wallet.adapter.name}!</b>
                        </h2>
                    </Box>

                    <Box className="w3-animate-bottom" style={{ marginTop: '20px', alignContent: 'center' }}>
                        <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App " onClick={airdropSol}>
                            Airdrop Devnet Sol
                        </button>
                    </Box>
                </Box>
            ) : (
                <Box className="App" style={{ height: '300px' }}>
                    <h1 className="w3-animate-opacity">
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>
            )}
        </Box>
    );
};
