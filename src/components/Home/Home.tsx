import React from 'react';
import { InputForm } from '../InputForm/InputForm';
import * as Web3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
import { Box } from '@mui/material';
import toast, { Toaster } from 'react-hot-toast';
import '../../App.css';
export const Home = () => {
    const rpc = new Web3.Connection(Web3.clusterApiUrl('devnet'));

    const { publicKey, wallet } = useWallet();

    const airdropSol = async () => {
        // const id = enqueueSnackbar("Airdrop in progress...", { variant: "info", persist: true })
        const id = toast.loading("Airdrop in progress...")
        try {
            if (publicKey) {

                const sig = await rpc.requestAirdrop(publicKey, Web3.LAMPORTS_PER_SOL * 1);
                await rpc.confirmTransaction(sig);

            }
            toast.dismiss(id)
            // closeSnackbar(id);
            // enqueueSnackbar("Airdrop Success", { variant: "success", })
            toast.success("Airdrop Success");

        }
        catch (e) {
            // closeSnackbar(id);
            toast.dismiss(id)
            console.error(e)
            // enqueueSnackbar("Airdrop Failed", { variant: "error" })
            toast.error("Airdrop failed , try after some time")

        }


    };

    return (
        <Box className="App">
            {publicKey && wallet ? (
                <Box className="App" sx={{ gap: "25px", marginTop: "20vh", width: "100vw"}}>
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
                        className="w3-animate-opacity center"

                    >
                        <h2 className='w3-animate-opacity'>
                            <b>Connected to {wallet.adapter.name}!</b>
                        </h2>
                    </Box>

                    <Box className="w3-animate-bottom" >
                        <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App " onClick={airdropSol}>
                            Airdrop Devnet Sol
                        </button>
                    </Box>
                </Box>
            ) : (
                <Box className="w3-animate-opacity" sx={{width: "100vw"}} >
                    <h1 style={{textAlign: "center", width: "100%"}}>
                        <b>Connect your Wallet!</b>
                    </h1>
                </Box>
            )}
        </Box>
    );
};
