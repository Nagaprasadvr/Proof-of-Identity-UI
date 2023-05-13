import { Form } from "@quillforms/renderer-core";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../App"
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
import { useState } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';

interface UserData {
    name: string,
    authority: string,
    contactNumber: string,
    dob: string,
    residenceAddress: string,
    panNumber: string,
    aadharNumber: string,
    passportId: string,
    // passportAttached: boolean,
    // aadharAttached: boolean,
    // panAttached: boolean,
    // picAttached: boolean

}






export const InputForm = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [data, setData] = useState<UserData | null>(null)
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);


    const setUserData = (inputData: any) => {
        const answers: any = inputData?.answers;
        const userData: UserData = {
            name: answers?.street.value as string,
            authority: answers?.wallet_add.value as string,
            contactNumber: answers?.phnum.value as string,
            dob: answers?.DOB.value as string,
            residenceAddress: answers?.country?.value as string,
            panNumber: answers?.pan.value as string,
            aadharNumber: answers?.id_number.value as string,
            passportId: answers?.passport_id?.value as string
        }

        setData(userData)

        console.log("data:", userData)

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
                                            errorsFontColor: "#fff",
                                            errorsBgColor: "#f00",
                                            progressBarFillColor: "lightskyblue",
                                            progressBarBgColor: "lightskyblue"
                                        },

                                    }}
                                    onSubmit={(data, { completeForm, setIsSubmitting }) => {
                                        setUserData(data)
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

