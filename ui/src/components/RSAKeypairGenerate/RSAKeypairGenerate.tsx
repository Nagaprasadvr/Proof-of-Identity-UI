import React from 'react';
import '../../App.css';
import axios from 'axios'
import { toast } from 'react-hot-toast';
const RSAKeypairGenerate = () => {

    const generateKeypair = async () => {
        const id = toast.loading("generating RSA Keypair...")
        try {
            const res = await axios.get("http://localhost:9000/cryptography/generateRSAKeyPair");
            const message = res.data.message;
            const success = res.data.success;
            toast.dismiss(id);
            if (success) {
                toast.success(message)
            }
            else {
                toast.error(message)
            }


        }
        catch (e) {
            console.error(e);
            toast.dismiss(id);
            toast.error("RSA keypair generation failed")
        }



    }

    return (
        <React.Fragment>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App " onClick={generateKeypair}>
                Genrate RSA Keypair
            </button>
        </React.Fragment>

    );

}

export default RSAKeypairGenerate;