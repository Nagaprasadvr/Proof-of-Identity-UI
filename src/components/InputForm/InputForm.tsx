import { Form } from "@quillforms/renderer-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App"
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import { registerCoreBlocks } from "@quillforms/react-renderer-utils";


registerCoreBlocks();

export const InputForm = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    return (
        <>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white" onClick={handleOpen}>Create Identity</button>

            <Modal open={open} onClose={handleClose} style={{ borderRadius: "50px", borderColor: "lightskyblue", border: "20px lightskyblue" }}>
                <Box className="App" style={{ marginTop: "100px" }}>
                    {
                        open && (
                            <Box width={600} height={600} style={{ borderRadius: "4rem", "borderColor": "lightskyblue" }}>
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
                                                id: "kd12edg",
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
                                                    label: "Your Resedential Address..",
                                                    description: "enter your present address"
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
                                                        id: "2aedfce",
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
                                            },
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
                                            errorsFontColor: "#fff",
                                            errorsBgColor: "#f00",
                                            progressBarFillColor: "lightskyblue",
                                            progressBarBgColor: "lightskyblue"
                                        }
                                    }}
                                    onSubmit={(data, { completeForm, setIsSubmitting }) => {
                                        setTimeout(() => {
                                            setIsSubmitting(false);
                                            completeForm();
                                        }, 500);
                                    }} applyLogic={false} isPreview={false} />
                            </Box>)
                    }

                </Box>

            </Modal>
        </>
    );
};

