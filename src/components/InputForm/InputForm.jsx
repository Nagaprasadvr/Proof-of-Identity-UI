import { Form } from "@quillforms/renderer-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App"
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
import DisabledByDefaultRoundedIcon from '@mui/icons-material/DisabledByDefaultRounded';
import welcome from "../Images/welcome.jpg"
import CancelIcon from '@mui/icons-material/Cancel';


registerCoreBlocks();

interface User
{
    name: string;
    authority: web3.PublicKey;
    contactNumber: string;
    dob: string;
    residenceAddress: string;
    panNumber: string;
    aadharNumber: string;
    passportId: string;
    passportAttached: boolean;
    aadharAttached: boolean;
    panAttached: boolean;
    picAttached: boolean

}

function initializeUser ()
{
    
}

export const InputForm = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white" onClick={handleOpen}>Create Identity</button>

            <Modal open={ open } onClose={ handleClose } style={ { borderRadius: "50px", borderColor: "lightskyblue", border: "20px lightskyblue" } }>
                
                <Box style={ { width: "100%", height: "100%" } }>
                    <Box style={{backgroundColor: "black"}}><button style={ {backgroundColor: "transparent", borderColor: "transparent"} } onClick={ handleClose}><CancelIcon style={{color: "lightskyblue",fontSize: "5vh"}}></CancelIcon></button></Box>
                    {
                        open && (
                            
                            <Form style={ { height: "100%", width: "100%" } }

                                formId="1"
                                formObj={ {
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
                                            id: "wallet",
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
                                            id: "Address",
                                            name: "group",
                                            attributes: {
                                                label: "Your Resedential Address.."
                                                , description: "enter your present address"
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
                                                    id: "Area",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "Address Line 2",
                                                        required: true,
                                                        placeholder: "Area and Post"
                                                    }
                                                },
                                                {
                                                    id: "district",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "City/Town",
                                                        required: true,
                                                        placeholder: "Tumkur"
                                                    }
                                                }, {

                                                    name: "short-text",
                                                    id: "state",
                                                    attributes: {
                                                        label: " State/Region/Province",
                                                        required: true,
                                                        placeholder: "Karnataka"
                                                    }
                                                }, {
                                                    id: "postal_code",
                                                    name: "number",
                                                    attributes: {
                                                        label: "zip / Post code",
                                                        required: true,
                                                        max: "10",
                                                        placeholder: "572102"
                                                    }
                                                }, {
                                                    id: "country",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "Country",
                                                        required: true,
                                                        placeholder: "India"
                                                    }
                                                }
                                                ,{
                                            name: "number",
                                            id: "phone_num",
                                            attributes: {
                                                label: "Enter your Phone Number...",
                                                required: true,

                                                "max": 10
                                            }
                                        },
                                            ]
                                        }, {
                                            id: "email",
                                            name: "email",
                                            attributes: {
                                                label: "Email",
                                                required: true,
                                                placeholder: "Write your email here!"
                                            }
                                        }, {
                                            name: "date",
                                            id: "DOB",
                                            attributes: {
                                                required: true,
                                                label: "Please type your birth of date!"
                                            }
                                        }, {
                                            name: "group",
                                            attributes: {
                                                label: "Government ID's",
                                                required: true,
                                            }
                                            innerBlocks:
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
                                        errorsFontColor: "black",
                                        errorsBgColor: "white",
                                        progressBarFillColor: "lightskyblue",
                                        progressBarBgColor: "lightskyblue"
                                    }


                                } }
                                onSubmit={ ( data, { completeForm, setIsSubmitting } ) =>
                                {   console.log(data)
                                    setTimeout( () =>
                                    {
                                        setIsSubmitting( false );
                                        completeForm();
                                    }, 500 );
                                } }
                            />
                        )      
                    }

                </Box>

            </Modal>
        </>
    );
};

