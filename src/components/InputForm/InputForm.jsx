import { Form } from "@quillforms/renderer-core";
import { Button } from "@mui/material"
import "bootstrap/dist/css/bootstrap.min.css";
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
registerCoreBlocks();

// registerCoreBlocks();
export const InputForm = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <Button variant="contained" onClick={handleOpen}>Create TAG</Button>

            <Modal open={open} onClose={handleClose} style={{ borderRadius: "50px" }}>
                <Box>
                    {
                        open && (<div style={{ width: "100%", height: "100vh" }}>

                            <Form
                                formId="1"
                                formObj={{
                                    blocks: [
                                        {
                                            name: "welcome-screen",
                                            id: "jg1401r",
                                            attributes: {
                                                label: "Welcome to our survey",
                                                description: "This is just a description",
                                                attachment: {
                                                    type: "image",
                                                    url:
                                                        "https://quillforms.com/wp-content/uploads/2022/01/4207-ai-1.jpeg"
                                                },
                                                attachmentMaxWidth: "300px"
                                            }
                                        },
                                        {
                                            name: "short-text",
                                            id: "kd12edg",
                                            attributes: {
                                                attachment: {
                                                    type: "image",
                                                    url:
                                                        "https://quillforms.com/wp-content/uploads/2022/10/ludovic-migneault-B9YbNbaemMI-unsplash_50-scaled.jpeg"
                                                },
                                                layout: "split-right",
                                                required: true,
                                                label: "Your Solana Wallet Address (Pubkey) ?",
                                                description: "please enter a valid Solana address!",
                                            }
                                        },
                                        {
                                            name: "short-text",
                                            id: "wer3qdkdb",
                                            attributes: {
                                                required: true,
                                                label: "Enter your Sol NameService domain if any..."
                                            }
                                        },
                                        {
                                            name: "number",
                                            id: "3nsdf934",
                                            attributes: {
                                                label: "Enter your Phone Number...",
                                                required: true,

                                                "max": 10
                                            }
                                        },
                                        {
                                            id: "1dsdf12e",
                                            name: "group",
                                            attributes: {
                                                label: "Your Resedential Address.."
                                                , description: "enter your present address"
                                            },
                                            innerBlocks: [
                                                {
                                                    id: "asfijais1e",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "address",
                                                        required: true,
                                                        placeholder: "Street and cross"
                                                    }
                                                },
                                                {
                                                    id: "7dsjsdv821",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "Address Line 2",
                                                        required: true,
                                                        placeholder: "Area and Post"
                                                    }
                                                },
                                                {
                                                    id: "2esad013x",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "City/Town",
                                                        required: true,
                                                        placeholder: "Tumkur"
                                                    }
                                                }, {

                                                    name: "short-text",
                                                    attributes: {
                                                        label: " State/Region/Province",
                                                        required: true,
                                                        placeholder: "Karnataka"
                                                    }
                                                }, {
                                                    id: "2esad013c",
                                                    name: "number",
                                                    attributes: {
                                                        label: "zip / Post code",
                                                        required: true,
                                                        max: "10",
                                                        placeholder: "572102"
                                                    }
                                                }, {
                                                    id: "2esad013b",
                                                    name: "short-text",
                                                    attributes: {
                                                        label: "Country",
                                                        required: true,
                                                        placeholder: "India"
                                                    }
                                                }
                                            ]
                                        }, {
                                            id: "2esad013a",
                                            name: "email",
                                            attributes: {
                                                label: "Email",
                                                required: true,
                                                placeholder: "Write your email here!"
                                            }
                                        }, {
                                            name: "date",
                                            id: "a213rsew",
                                            attributes: {
                                                required: true,
                                                label: "Please type your birth of date!"
                                            }
                                        }, {

                                        }






                                    ],
                                    settings: {
                                        animationDirection: "vertical",
                                        disableWheelSwiping: false,
                                        disableNavigationArrows: false,
                                        disableProgressBar: false
                                    },
                                    theme: {
                                        font: "Roboto",
                                        buttonsBgColor: "#9b51e0",
                                        logo: {
                                            src: ""
                                        },
                                        questionsColor: "#000",
                                        answersColor: "#0aa7c2",
                                        buttonsFontColor: "#fff",
                                        buttonsBorderRadius: 25,
                                        errorsFontColor: "#fff",
                                        errorsBgColor: "#f00",
                                        progressBarFillColor: "#000",
                                        progressBarBgColor: "#ccc"
                                    }
                                }}
                                onSubmit={(data, { completeForm, setIsSubmitting }) => {
                                    setTimeout(() => {
                                        setIsSubmitting(false);
                                        completeForm();
                                    }, 500);
                                }}
                            />
                        </div>)
                    }
                </Box>
            </Modal>
        </>
    );
};

