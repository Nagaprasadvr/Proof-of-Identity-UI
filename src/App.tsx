import './App.css';
import { Navbar } from './components/Navbar/Navbar.component';
import { Blog } from './components/Blog/blog';
import { Home } from './components/Home/Home';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { Routes, Route } from 'react-router-dom';
import Design from './components/DesignPage/DesignPage';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import React from 'react';
import { useMemo } from 'react';
import { ViewIdentity } from './components/ViewIdentity/ViewIdentity';
import Navigation from './components/Navbar/Navigation';
import BundlrUpload from "./components/BundlrUpload/BundlrUpload"
import { Box } from '@mui/material';
require('bootstrap/dist/css/bootstrap.min.css');

function App() {
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);

    const wallets = useMemo(
        () => [new PhantomWalletAdapter()],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [network]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets}>
                <WalletModalProvider>
                    <Box>
                        <Box style={{ height: '150px' }}>
                            <Navbar />
                        </Box>

                        <Routes>
                            <Route path="/" element={<Home />}></Route>
                            <Route path="/design" element={<Design />}></Route>
                            <Route path="/blog" element={<Blog />}></Route>
                            <Route path="/ViewIdentity" element={<BundlrUpload />}></Route>
                        </Routes>
                    </Box>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
