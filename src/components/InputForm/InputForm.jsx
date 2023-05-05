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
                        open && (<div style={{ width: "90%", height: "90vh", marginTop: "5vh", marginLeft: "5%" }}>
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
                                                }
                                            }
                                        },
                                        {
                                            name: "short-text",
                                            id: "kd12edg",
                                            attributes: {
                                                classnames: "first-block",
                                                required: true,
                                                label: "Let's start with your name"
                                            }
                                        },
                                        {
                                            name: "multiple-choice",
                                            id: "gqr1294c",
                                            attributes: {
                                                required: true,
                                                multiple: true,
                                                verticalAlign: false,
                                                label: "Which subjects do you love the most?",
                                                choices: [
                                                    {
                                                        label: "Physics",
                                                        value: "physics"
                                                    },
                                                    {
                                                        label: "Math",
                                                        value: "math"
                                                    },
                                                    {
                                                        label: "English",
                                                        value: "english"
                                                    },
                                                    {
                                                        label: "Biology",
                                                        value: "biology"
                                                    }
                                                ]
                                            }
                                        },
                                    ],
                                }}
                                onSubmit={(data, { completeForm, setIsSubmitting, goToBlock, setSubmissionErr }) => {
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

