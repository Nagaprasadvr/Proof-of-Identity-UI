import { Form } from "@quillforms/renderer-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App"
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import * as solana from "@solana/web3.js"
import * as digitalIdentity from "../../digitalIdentity/js/src/generated";
import * as anchor from "@project-serum/anchor"
import toast from "react-hot-toast"
import { useWallet } from "@solana/wallet-adapter-react";
import { closeSnackbar, enqueueSnackbar } from "notistack";
interface UserData {
    name: string,
    contactNumber: string,
    dob: string,
    residenceAddress: string,
    panNumber: string,
    aadharNumber: string,
    passportId: string,
}



export const InputForm = () => {
    const solWallet = useWallet();
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);



    const setUserData = (inputData: any) => {
        const answers: any = inputData?.answers;
        const userData: UserData = {
            name: answers?.street.value.toString(),
            contactNumber: (answers?.phnum.value as number).toString() as string,
            dob: answers?.DOB.value.toString(),
            residenceAddress: answers?.country?.value.toString(),
            panNumber: answers?.pan.value.toString(),
            aadharNumber: answers?.id_number.value.toString(),
            passportId: answers?.passport_id?.value.toString()
        }



        console.log("data:", userData)
        return userData;

    }


    const createIdentity = async (toastId: string, data: UserData) => {
        toast.dismiss(toastId)
        const rpcCon = new solana.Connection(solana.clusterApiUrl("devnet"))
        console.log("calling")
        const id = toast.loading("Creating Digital Identity...")
        try {

            console.log("inside try")
            if (solWallet?.publicKey) {
                console.log("inisde")
                const [identityPda, pdaBump] = solana.PublicKey.findProgramAddressSync([
                    Buffer.from("dig_identity"),
                    solWallet?.publicKey?.toBuffer()
                ], digitalIdentity.PROGRAM_ID)
                console.log("pda:", identityPda.toBase58())
                const createDigitalIdentityAccounts: digitalIdentity.CreateIdentityInstructionAccounts = {
                    digIdentityAcc: identityPda,
                    systemProgram: solana.SystemProgram.programId,
                    authority: solWallet.publicKey

                }
                const test: digitalIdentity.DigitalIdentityParam = { name: "harsha", contactNumber: "98762518326", dob: "25-09-2001", residenceAddress: "tumkur", panNumber: "kadh96y29", aadharNumber: "9187987dhjao", passportId: "2oehiy992" }
                const args: digitalIdentity.CreateIdentityInstructionArgs = {
                    createIdentityParams: data as UserData
                }
                const ix0 = digitalIdentity.createCreateIdentityInstruction(createDigitalIdentityAccounts, args);
                if (solWallet.signTransaction) {
                    console.log("inx")
                    console.log("inx:", ix0)
                    const tx0 = new solana.Transaction().add(ix0);
                    tx0.recentBlockhash = (await rpcCon.getLatestBlockhash()).blockhash
                    tx0.feePayer = solWallet.publicKey
                    // const signedTx0 = await solWallet.signTransaction(tx0);
                    console.log("sending tx")
                    const signature = await solWallet.sendTransaction(tx0, rpcCon);
                    if (signature) {
                        const txSig = `https://explorer.solana.com/tx/${signature} `
                        toast.dismiss(id)
                        toast.success(<>
                            <Box>
                                <p style={{ color: "black" }}>Digital Identity has been created Successfully with tx</p>
                                <a href={txSig}>Tx</a>
                            </Box>
                        </>)
                    }

                }


            }

        }
        catch (e) {
            toast.dismiss(id);
            toast.error("Digital identity creation failed")
            console.error(e)
        }

    }
    return (
        <>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white" onClick={handleOpen}>Create Identity</button>

            <Modal open={open} onClose={handleClose} style={{ width: "100vw", height: "100vh" }}>
                <Box className="App" >
                    {
                        open && (
                            <Box style={{ width: "100vw", height: "100vh" }}>
                                <Box style={{ backgroundColor: "black" }}><button style={{ backgroundColor: "transparent", borderColor: "transparent" }} onClick={handleClose}><CancelIcon style={{ color: "lightskyblue", fontSize: "50px" }}></CancelIcon></button></Box>
                                <Form
                                    formId={1987}
                                    formObj={{
                                        blocks: [
                                            {
                                                name: "welcome-screen",
                                                id: "jg1401r",
                                                attributes: {
                                                    label: "Create your Digital Identity",
                                                    description: "",
                                                    // attachment: {
                                                    //     type: "image",
                                                    //     url:
                                                    //         "https://quillforms.com/wp-content/uploads/2022/01/4207-ai-1.jpeg"
                                                    // },
                                                    // attachmentMaxWidth: "300px"
                                                }
                                            },
                                            {
                                                name: "short-text",
                                                id: "wallet_add",
                                                attributes: {
                                                    // attachment: {
                                                    //     type: "image",
                                                    //     url:
                                                    //         "https://quillforms.com/wp-content/uploads/2022/10/ludovic-migneault-B9YbNbaemMI-unsplash_50-scaled.jpeg"
                                                    // },
                                                    // layout: "split-right",
                                                    required: true,
                                                    label: "Your Solana Wallet Address (Pubkey) ?",
                                                    description: "please enter a valid Solana address!",
                                                }
                                            },
                                            {
                                                name: "short-text",
                                                id: "url",
                                                attributes: {
                                                    required: true,
                                                    label: "Enter your Sol NameService domain if any..."
                                                }
                                            },
                                            {
                                                id: "1dsdf12e",
                                                name: "group",
                                                attributes: {
                                                    label: "Your Resedential Address..",
                                                    description: "enter your present address"
                                                },
                                                innerBlocks: [
                                                    {
                                                        id: "street",
                                                        name: "short-text",
                                                        attributes: {
                                                            label: "address",
                                                            required: true,
                                                            placeholder: "Street and cross"
                                                        }
                                                    },
                                                    {
                                                        id: "area",
                                                        name: "short-text",
                                                        attributes: {
                                                            label: "Address Line 2",
                                                            required: true,
                                                            placeholder: "Area and Post"
                                                        }
                                                    },
                                                    {
                                                        id: "city",
                                                        name: "short-text",
                                                        attributes: {
                                                            label: "City/Town",
                                                            required: true,
                                                            placeholder: "Tumkur"
                                                        }
                                                    }, {
                                                        id: "state",
                                                        name: "short-text",
                                                        attributes: {
                                                            label: " State/Region/Province",
                                                            required: true,
                                                            placeholder: "Karnataka"
                                                        }
                                                    }, {
                                                        id: "zip",
                                                        name: "number",
                                                        attributes: {
                                                            label: "zip / Post code",
                                                            required: true,
                                                            max: "10",
                                                            placeholder: "572102",
                                                            min: 6
                                                        }
                                                    }, {
                                                        id: "country",
                                                        name: "short-text",
                                                        attributes: {
                                                            label: "Country",
                                                            required: true,
                                                            placeholder: "India"
                                                        }
                                                    }, {
                                                        name: "number",
                                                        id: "phnum",
                                                        attributes: {
                                                            label: "Enter your Phone Number...",
                                                            required: true,

                                                            max: 10,
                                                            min: 10
                                                        }
                                                    },
                                                ]
                                            }, {
                                                id: "email",
                                                name: "email",
                                                attributes: {
                                                    label: "Email",
                                                    required: true,
                                                    placeholder: "Type your email here!"
                                                }
                                            }, {
                                                name: "date",
                                                id: "DOB",
                                                attributes: {
                                                    required: true,
                                                    label: "Date of Birth!"
                                                }
                                            },
                                            {
                                                id: "1dsdf12xx",
                                                name: "group",
                                                attributes: {
                                                    label: "Government_ids",
                                                    description: "Enter your valid Id's"
                                                },
                                                innerBlocks: [
                                                    {
                                                        name: "short-text",
                                                        id: "id_number",
                                                        attributes: {
                                                            required: true,
                                                            label: "Enter your Aadhar/SSN number or any type of Identity number recognized by government",
                                                            placeholder: "Enter your identity"
                                                        }
                                                    },
                                                    {
                                                        name: "short-text",
                                                        id: "pan",
                                                        attributes: {
                                                            required: true,
                                                            label: "Enter your PAN number..",
                                                        }
                                                    }, {
                                                        name: "short-text",
                                                        id: "passport_id",
                                                        attributes: {
                                                            required: true,
                                                            label: "Enter your PASSPORT number..",
                                                        }
                                                    },

                                                ]
                                            }
                                        ],
                                        settings: {
                                            animationDirection: "vertical",
                                            disableWheelSwiping: false,
                                            disableNavigationArrows: false,
                                            disableProgressBar: false,
                                            showQuestionsNumbers: true,
                                        },
                                        theme: {
                                            font: "Roboto",
                                            buttonsBgColor: "lightskyblue",
                                            logo: {
                                                src: ""
                                            },
                                            backgroundColor: "black",
                                            questionsColor: "lightskyblue",
                                            answersColor: "lightskyblue",
                                            buttonsFontColor: "white",
                                            buttonsBorderRadius: 25,
                                            errorsFontColor: "lightsky",
                                            errorsBgColor: "white",
                                            progressBarFillColor: "lightskyblue",
                                            progressBarBgColor: "lightskyblue"
                                        },

                                    }}
                                    onSubmit={async (data, { completeForm, setIsSubmitting }) => {




                                        // setIsSubmitting(false);
                                        completeForm();
                                        const userData = setUserData(data);
                                        const id = toast.loading("loading")
                                        setTimeout(async () => {

                                            await createIdentity(id, userData)
                                        }, 3000)

                                    }} applyLogic={true} isPreview={false} />
                            </Box>)
                    }

                </Box>

            </Modal>
        </>
    );
};

