import React from 'react';
import { InputForm } from '../InputForm/InputForm';
import '../../App.css';
import { useState, useEffect } from 'react';
import * as Web3 from '@solana/web3.js';
import { useWallet } from '@solana/wallet-adapter-react';
export const Home = () => {
    const rpc = new Web3.Connection(Web3.clusterApiUrl('devnet'));

    const { publicKey, wallet } = useWallet();
    const [balance, setBalance] = useState(null);
    const [walletName, setWalletName] = useState(wallet.adapter.name);

    useEffect(() => {
        setWalletName(wallet.adapter.name);
    }, [wallet]);
    useEffect(() => {
        setBalance(null);
    }, [publicKey]);
    const checkBalance = () => {
        rpc.getBalance(publicKey).then((balance) => {
            setBalance(balance);
        });
    };

    return (
        <div className="App">
            {publicKey ? (
                <div className="App">
                    <h1 className="w3-animate-opacity">
                        <b>Create your Digital identity on Solana chain!</b>
                    </h1>

                    <div className="w3-animate-opacity w3-jumbo">
                        <i className="fa fa-fingerprint" style={{ color: 'lightskyblue' }}></i>
                    </div>
                    <div className="w3-animate-top">
                        <InputForm />
                    </div>

                    <div className="w3-animate-bottom" style={{ marginTop: '20px', alignContent: 'center' }}>
                        <button className="balance-button w3-btn w3-hover-white App " onClick={checkBalance}>
                            Check {walletName} Wallet Balance
                        </button>
                    </div>
                    {balance ? (
                        <div className="w3-animate-opacity" style={{ marginTop: '20px' }}>
                            <h1>
                                <b>
                                    Your Solana {walletName} wallet balance on devent is : {balance / Web3.LAMPORTS_PER_SOL} Sol
                                </b>
                            </h1>
                        </div>
                    ) : (
                        <div>
                            <h1>...</h1>
                        </div>
                    )}
                </div>
            ) : (
                <div className="App" style={{ height: '300px' }}>
                    <h1 className="w3-animate-opacity">
                        <b>Connect your Wallet!</b>
                    </h1>
                </div>
            )}
        </div>
    );
};
