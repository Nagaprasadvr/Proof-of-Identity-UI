import './App.css';
import { Navibar } from './components/Navbar/Navbar.component';
import { Blog } from './components/Blog/blog';
import { Home } from './components/Home/Home';
import { ConnectionProvider, WalletProvider, useWallet } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Routes, Route } from 'react-router-dom';
import Design from './components/DesignPage/DesignPage';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { ViewIdentity } from './components/ViewIdentity/ViewIdentity';
import BundlrUpload from './components/BundlrUpload/BundlrUpload';
import { Box } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import Navigation from './components/Navbar/Navigation';
import Allusers from './components/SearchIdentity/SearchIdentity';
import axios from 'axios';
import DecidePage from './components/IncomingRequests/IncomingRequests';
import * as sdk from './digitalIdentity/js/src/generated';
import MyRequests from './components/OutgoingRequests/OutgoingRequests';
require('bootstrap/dist/css/bootstrap.min.css');

export interface RSAKeypair {
    pubKey: string;
    privateKey: string;
}

export interface RSAKepairVariants {
    keypair512: RSAKeypair;
    keypair1028: RSAKeypair;
}

function App() {
    const [serverConnected, setServerConnected] = useState<boolean>(false);
    const [RSAKeypairs, setRSAKeypairs] = useState<RSAKepairVariants | null>(null);
    const [digIdentityAcc, setDigIdentityAcc] = useState<sdk.DigitalIdentity | null>(null);
    const wallet = useWallet();
    useEffect(() => {
        const serverConnect = async () => {
            try {
                await axios.get('http://localhost:9000/');
                setServerConnected(true);
            } catch (e) {
                setServerConnected(false);
            }
        };

        serverConnect();
    });
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter(), new SolflareWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    useEffect(() => {
        const fetchDigitalIdentity = async () => {
            const rpcConn = new Connection(clusterApiUrl('devnet'));
            if (wallet?.publicKey) {
                try {
                    const [digitalPdaAcc, bump] = PublicKey.findProgramAddressSync(
                        [Buffer.from('dig_identity'), wallet?.publicKey.toBuffer()],
                        sdk.PROGRAM_ID
                    );
                    const acc = await sdk.DigitalIdentity.fromAccountAddress(rpcConn, digitalPdaAcc);
                    setDigIdentityAcc(acc);
                } catch (e) {
                    console.error(e);
                }
            }
        };
        if (wallet?.connected && serverConnected && wallet?.publicKey) {
            fetchDigitalIdentity();
        }
    }, [serverConnected, wallet?.connected, wallet?.publicKey]);

    useEffect(() => {
        const fetchKeypair = async () => {
            if (serverConnected) {
                try {
                    const res = await axios.get('http://localhost:9000/cryptography/getRSAKeypair');
                    if (res.data.status === true) {
                        const rsaKeypairs: RSAKepairVariants = {
                            keypair512: res.data.keypair_512,
                            keypair1028: res.data.keypair_1028,
                        };

                        setRSAKeypairs(rsaKeypairs);
                    }
                } catch (e) {}
            }
        };
        if (serverConnected) {
            fetchKeypair();
        }
    }, [serverConnected]);
    return (
        <>
            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <Toaster
                            position="bottom-left"
                            toastOptions={{
                                style: {
                                    color: 'black',
                                    backgroundColor: 'lightskyblue',
                                    width: '100vw',
                                    fontFamily: 'Roboto Mono,monospace',
                                    fontWeight: '600',
                                },
                            }}
                        />
                        <Box>
                            <Box>
                                <Navigation></Navigation>
                            </Box>

                            <Routes>
                                <Route path="/" element={<Home connected={serverConnected} />}></Route>
                                {/* <Route path="/design" element={<Design />}></Route> */}
                                <Route
                                    path="/SearchIdentity"
                                    element={
                                        <Allusers
                                            connected={serverConnected}
                                            rsaKeypairs={RSAKeypairs as RSAKepairVariants}
                                        />
                                    }
                                ></Route>
                                {/* <Route path="/blog" element={<Blog />}></Route> */}
                                <Route
                                    path="/ViewIdentity"
                                    element={
                                        <ViewIdentity connected={serverConnected} digIdentityAcc={digIdentityAcc} />
                                    }
                                ></Route>
                                <Route
                                    path="/MyResponses"
                                    element={<DecidePage serverConnected={serverConnected}></DecidePage>}
                                ></Route>
                                <Route
                                    path="/MyRequests"
                                    element={<MyRequests serverConnected={serverConnected}></MyRequests>}
                                ></Route>
                            </Routes>
                        </Box>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
}

export default App;
