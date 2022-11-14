import React from 'react';
import { InputForm } from '../InputForm/InputForm';
import '../../App.css';
import { useWallet } from '@solana/wallet-adapter-react';
export const Home = () => {
    const user = useWallet();
    return (
        <div className="App">
            <h1 className="w3-animate-opacity">
                <b>Create your Digital identity on Solana chain!</b>
            </h1>
            {user ? (
                <h1 className="w3-animate-opacity">
                    <b>make your fingerprint on solana {user}!</b>
                </h1>
            ) : (
                <h1 className="w3-animate-opacity">Connect Your Wallet !</h1>
            )}

            <div className="w3-animate-opacity w3-jumbo">
                <i className="fa fa-fingerprint" style={{ color: 'lightskyblue' }}></i>
            </div>
            <InputForm />
        </div>
    );
};
