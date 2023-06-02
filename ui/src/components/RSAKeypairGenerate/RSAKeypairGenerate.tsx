import React from 'react';
import '../../App.css';
import axios from 'axios'
const RSAKeypairGenerate = () => {

    const generateKeypair = async () => {
        try {
            console.log("hitting")
            const res = await axios.get("http://localhost:9000/cryptography/generateRSAKeyPair");
            console.log(res);

        }
        catch (e) {
            console.error(e)
        }



    }

    return (
        <React.Fragment>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App " onClick={generateKeypair}>
                RSA genrate Keypair
            </button>
        </React.Fragment>

    );

}

export default RSAKeypairGenerate;