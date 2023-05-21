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
import React from 'react';
import { useMemo } from 'react';
import { ViewIdentity } from './components/ViewIdentity/ViewIdentity';
import BundlrUpload from "./components/BundlrUpload/BundlrUpload"
import { Box } from '@mui/material';
import { Toaster } from 'react-hot-toast';
import './App.css';
import Navigation from './components/Navbar/Navigation';
require('bootstrap/dist/css/bootstrap.min.css');

function App() {
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
                                {/* <Navibar /> */}
                                <Navigation></Navigation>
                            </Box>

                            <Routes>
                                <Route path="/" element={<Home />}></Route>
                                <Route path="/design" element={<Design />}></Route>
                                <Route path="/blog" element={<Blog />}></Route>
                                <Route path="/ViewIdentity" element={<ViewIdentity />}></Route>
                            </Routes>
                        </Box>
                    </WalletModalProvider>
                </WalletProvider>
            </ConnectionProvider>
        </>
    );
}

export default App;
