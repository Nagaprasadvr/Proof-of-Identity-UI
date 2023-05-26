import { WebBundlr } from "@bundlr-network/client";
import { useWallet } from "@solana/wallet-adapter-react";
import * as solana from "@solana/web3.js"
import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import "../../App.css";

const BundlrUpload = () => {

    const walletProvider = useWallet();
    const [bundlr, setBundlr] = useState<WebBundlr>();


    useEffect(() => {
        const getBundlrInstance = async () => {
            try {

                if (walletProvider?.publicKey) {
                    const bundlr = new WebBundlr("http://node2.bundlr.network", "solana", walletProvider);
                    await bundlr.ready()
                    console.log("firing")
                    setBundlr(bundlr)
                    console.log("bunldr:", bundlr)
                }


            }
            catch (e) {
                console.error("error in connecting to Bundlr")
            }

        }

        getBundlrInstance()
    }, [walletProvider])


    const uploadString = async () => {
        console.log("clicked")
        try {
            console.log(bundlr)
            if (bundlr) {
                const response = await bundlr.upload("Solana Bundlr");
                console.log(`Data uploaded ==> https://arweave.net/${response.id}`);
            }
        }
        catch (e) {
            console.error("error in uploading")
        }

    }

    return (
        <>
            <Box className="App" >
                <button className="balance-button w3-btn w3-hover-white App" style={{ width: "auto" }} onClick={uploadString}>
                    Upload
                </button>
            </Box>

        </>
    )

}

export default BundlrUpload;