import './App.css';
import { Navibar } from './components/Navbar/Navbar.component';
import { Blog } from './components/Blog/blog';
import { Home } from './components/Home/Home';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Routes, Route } from 'react-router-dom';
import Design from './components/DesignPage/DesignPage';
import { PhantomWalletAdapter, SolflareWalletAdapter } from '@solana/wallet-adapter-wallets';
import React, { useEffect, useState } from 'react';
import { useMemo } from 'react';
import { ViewIdentity } from './components/ViewIdentity/ViewIdentity';
import BundlrUpload from "./components/BundlrUpload/BundlrUpload"
import { Box } from '@mui/material';
import { Toaster, toast } from 'react-hot-toast';
import './App.css';
import Navigation from './components/Navbar/Navigation';
import Allusers from './components/AllUsers/Allusers';
import axios from 'axios';
require('bootstrap/dist/css/bootstrap.min.css');

function App() {
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        const serverConnect = async () => {
            try {
                await axios.get("http://localhost:9000/");
                setConnected(true)
            }
            catch (e) {
                setConnected(false)
            }
        }

        serverConnect()
    })
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter()
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <>

            <ConnectionProvider endpoint={endpoint}>
                <WalletProvider wallets={wallets}>
                    <WalletModalProvider>
                        <Toaster position='bottom-left' toastOptions={{ style: { color: "black", backgroundColor: "lightskyblue", width: "100vw" } }} />
                        <Box>
                            <Box>
                                <Navigation></Navigation>
                            </Box>

                            <Routes>
                                <Route path="/" element={<Home connected={connected} />}></Route>
                                <Route path="/design" element={<Design />}></Route>
                                <Route path="/Allusers" element={<Allusers connected={connected} />}></Route>
                                <Route path="/blog" element={<Blog />}></Route>
                                <Route path="/ViewIdentity" element={<ViewIdentity connected={connected} />}></Route>
                            </Routes>
                        </Box>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
}

export default App;


