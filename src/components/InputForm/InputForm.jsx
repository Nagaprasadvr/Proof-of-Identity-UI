// import { PopupButton } from "@typeform/embed-react";
// import React from "react";


// import { Form } from "@quillforms/renderer-core";
// import "@quillforms/renderer-core/build-style/style.css";
import { Form } from "@quillforms/renderer-core";
import { Button } from "@mui/material"
import "bootstrap/dist/css/bootstrap.min.css";
import "./InputForm.css";
import "@quillforms/renderer-core/build-style/style.css";
// import { registerCoreBlocks } from "@quillforms/react-renderer-utils";
import { useState } from "react";

// registerCoreBlocks();
export const InputForm = () => {
    const [form, openForm] = useState(false);

    return (
        <>
            <button style={{ width: "auto" }} className="balance-button w3-btn w3-hover-white App" onClick={() => { openForm(!form) }}>
                Create Identity
            </button>



            {form ?

                (<div style={{ width: "800px", height: "800px", paddingTop: "20px", }} >
                    <Form
                        style={{ borderRadius: "10px" }}
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
                    /></div >) : null}



        </>
    );
};

