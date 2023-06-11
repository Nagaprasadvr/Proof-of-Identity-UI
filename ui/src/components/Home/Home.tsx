import React, { useEffect, useState } from 'react';
import { InputForm } from '../InputForm/InputForm';
import * as Web3 from '@solana/web3.js';
import { WalletContextState, useWallet } from '@solana/wallet-adapter-react';
import { Box } from '@mui/material';
import toast from 'react-hot-toast';
import axios from 'axios';
import '../../App.css';
import RSAKeypairGenerate from '../RSAKeypairGenerate/RSAKeypairGenerate';

export interface ServerConnectionProps {
    connected: boolean;
}
export const Home = ({ connected }: ServerConnectionProps) => {
    const [keypairGenerated, setKeypairGenerated] = useState<boolean>(false);
    const [trigger, setTrigger] = useState<boolean>(false);
    const rpc = new Web3.Connection(Web3.clusterApiUrl('devnet'));

    const { publicKey, wallet } = useWallet();

    const airdropSol = async () => {
        const id = toast.loading("Airdrop in progress...")
        try {
            if (publicKey) {

                const sig = await rpc.requestAirdrop(publicKey, Web3.LAMPORTS_PER_SOL * 1);
                await rpc.confirmTransaction(sig);

            }
            toast.dismiss(id)

            toast.success("Airdrop Success");

        }
        catch (e) {
            toast.dismiss(id)
            console.error(e)
            toast.error("Airdrop failed , try after some time")

        }


    };


    useEffect(() => {
        const checkKeypairGenerated = async () => {
            try {
                const res = await axios.get("http://localhost:9000/cryptography/keypairExistence");
                if (res.data.message === true) {
                    setKeypairGenerated(true);

                }
                else {
                    setKeypairGenerated(false)
                }
            }
            catch (e) {
                toast.error("Not able to Connect to Server")
            }



        }

        if (publicKey && wallet) {
            checkKeypairGenerated()
        }

    }, [publicKey, wallet, trigger])


    return (
        <Box className="App">
            {connected ? (
                publicKey && wallet ? (
                    keypairGenerated ? (<Box className="App" sx={{ gap: "25px", marginTop: "20vh", width: "100vw" }}>
                        <h1 className="w3-animate-opacity">
                            <b >Create your Digital Identity on Solana!</b>
                        </h1>

                        <Box className="w3-animate-opacity w3-jumbo">
                            <i className="fa fa-fingerprint" style={{ color: 'lightskyblue' }}></i>
                        </Box>
                        <Box className="w3-animate-top">
                            <InputForm />
                        </Box>
                        <Box className="w3-animate-bottom" >
                            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App " onClick={airdropSol}>
                                Airdrop Devnet Sol
                            </button>
                        </Box>

                        <Box
                            className="w3-animate-opacity center">
                            <h2 className='w3-animate-opacity'>
                                <b>Connected to {wallet.adapter.name}!</b>
                            </h2>
                        </Box>
                    </Box>) : (
                        <Box className="w3-animate-opacity App" sx={{
                            marginTop: "20vh", width: "100vw"
                        }} >
                            <h1 className="w3-animate-opacity">
                                <b >Generate Keypair to proceed!</b>
                            </h1>
                            <Box className="w3-animate-top" sx={{ marginTop: "20px" }}>
                                <RSAKeypairGenerate setTrigger={setTrigger} />
                            </Box>
                        </Box>

                    )

                ) : (
                    <Box className="w3-animate-opacity App" sx={{
                        marginTop: "20vh", width: "100vw"
                    }} >
                        <h1>
                            <b> Connect your Wallet!</b>
                        </h1 >
                    </Box >
                )
            ) : (
                <Box className="w3-animate-opacity App" sx={{
                    marginTop: "20vh", width: "100vw"
                }} >
                    <h1>
                        <b>Protocol Down!</b>
                    </h1 >
                </Box >
            )}

        </Box >
    );
};
