import { Form } from '@quillforms/renderer-core';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App';
import './InputForm.css';
import '@quillforms/renderer-core/build-style/style.css';
import { useEffect, useMemo, useState } from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import CancelIcon from '@mui/icons-material/Cancel';
import * as solana from '@solana/web3.js';
import * as digitalIdentity from '../../digitalIdentity/js/src/generated';
import * as anchor from '@project-serum/anchor';
import toast from 'react-hot-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { Typography } from '@mui/material';
import axios from 'axios';
export interface UserData {
    [key: string]: string;
    name: string;
    contactNumber: string;
    dob: string;
    residenceAddress: string;
    panNumber: string;
    aadharNumber: string;
    passportId: string;
}

export interface UserDataLinks {
    panUploadLink: string;
    passportUploadLink: string;
    aadharUploadLink: string;
}

export const InputForm = () => {
    const solWallet = useWallet();
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => {
        if (isExists) {
            toast.error('Digital Identity Already Exists, You cannot create more than one Identity');
            return;
        } else if (!isExists) {
            setOpen(true);
        }
    };

    const handleClose = () => setOpen(false);
    const [isExists, setIsExist] = useState<boolean>(false);

    const rpcCon = useMemo(() => {
        return new solana.Connection(solana.clusterApiUrl('devnet'));
    }, []);

    useEffect(() => {
        const checkIdentityAlreadyExists = async () => {
            if (solWallet?.publicKey) {
                const [identityPda, pdaBump] = solana.PublicKey.findProgramAddressSync(
                    [Buffer.from('dig_identity'), solWallet.publicKey?.toBuffer()],
                    digitalIdentity.PROGRAM_ID
                );
                try {
                    const identityAcc = await digitalIdentity.DigitalIdentity.fromAccountAddress(rpcCon, identityPda);

                    if (identityAcc) {
                        setIsExist(true);
                    }
                } catch (e) {
                    setIsExist(false);
                    console.error(e);
                }
            }
        };
        if (solWallet.publicKey && rpcCon) {
            checkIdentityAlreadyExists();
        }
    }, [rpcCon, solWallet.publicKey]);

    const setUserData = (inputData: any) => {
        const answers: any = inputData?.answers;
        const userData: UserData = {
            name: answers?.name.value.toString(),
            contactNumber: (answers?.phnum.value as number).toString() as string,
            dob: answers?.DOB.value.toString(),
            residenceAddress: answers?.address.value.toString(),
            panNumber: answers?.pan.value.toString(),
            aadharNumber: answers?.id_number.value.toString(),
            passportId: answers?.passport_id?.value.toString(),
        };

        return userData;
    };

    const validateForm = (data: any) => {
        const errors: string[] = [];
        console.log('formData: ', data.answers);

        // Validate phone number
        const phonePattern = /^\d{10}$/;
        if (!phonePattern.test(data.answers.phnum.value)) {
            console.log('Please enter a valid 10-digit phone number');
            errors.push('Invalid Phone number');
            // You can display an error message or handle the validation error as required
        }

        // Validate Aadhar/SSN number
        // Assuming Aadhar/SSN number is a 12-digit number
        const aadharPattern = /^\d{12}$/;
        if (!aadharPattern.test(data.answers.id_number.value)) {
            console.log('Please enter a valid 12-digit Aadhar/SSN number');
            errors.push('Invalid Aadhar number');
            // You can display an error message or handle the validation error as required
        }

        // Validate PAN number
        const panPattern = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
        if (!panPattern.test(data.answers.pan.value)) {
            console.log('Please enter a valid PAN number');
            errors.push('Invalid Pan number');
            // You can display an error message or handle the validation error as required
        }

        const passportPattern = /^[A-Za-z0-9]{6,10}$/;
        if (!passportPattern.test(data.answers.passport_id.value)) {
            console.log('Please enter a valid passport number');
            errors.push('Invalid Passport');
            // You can display an error message or handle the validation error as required
        }

        if (!data.answers.address.value) {
            console.log('Please enter your address');
            errors.push('you missed your address');
            // You can display an error message or handle the validation error as required
        }

        var enteredDate = new Date(data.answers.DOB.value);
        console.log(enteredDate);
        var currentDate = new Date();

        // Extract year, month, and day from the entered date
        var enteredYear = enteredDate.getFullYear();
        var enteredMonth = enteredDate.getMonth() + 1; // Months are zero-based
        var enteredDay = enteredDate.getDate();

        if (
            isNaN(enteredYear) ||
            isNaN(enteredMonth) ||
            isNaN(enteredDay) ||
            enteredYear < 1900 || // Assuming a minimum DOB year of 1900
            enteredYear > currentDate.getFullYear() || // Assuming a maximum DOB year as the current year
            enteredMonth < 1 ||
            enteredMonth > 12 || // Month should be between 1 and 12
            enteredDay < 1 ||
            enteredDay > 31 || // Day should be between 1 and 31
            enteredDate >= currentDate
        ) {
            errors.push('Invalid Date of Birth');
        }

        return errors;
    };

    // const onSubmit = async (data: any, { completeForm, setIsSubmitting }: any) => {
    //     // Validate the form data
    //     const errors = validateForm(data);

    //     if (Object.keys(errors).length > 0) {
    //         // Display the validation errors
    //         console.log('Validation errors:', errors);
    //         return;
    //     }

    //     // Proceed with form submission if validation passes
    //     // ...
    // };

    const createIdentity = async (toastId: string, data: UserData) => {
        toast.dismiss(toastId);

        const id = toast.loading('Creating Digital Identity...');
        try {
            if (solWallet?.publicKey) {
                const [identityPda, pdaBump] = solana.PublicKey.findProgramAddressSync(
                    [Buffer.from('dig_identity'), solWallet?.publicKey?.toBuffer()],
                    digitalIdentity.PROGRAM_ID
                );
                const createDigitalIdentityAccounts: digitalIdentity.CreateIdentityInstructionAccounts = {
                    digIdentityAcc: identityPda,
                    systemProgram: solana.SystemProgram.programId,
                    authority: solWallet.publicKey,
                };

                const args: digitalIdentity.CreateIdentityInstructionArgs = {
                    createIdentityParams: data as UserData,
                };
                const ix0 = digitalIdentity.createCreateIdentityInstruction(createDigitalIdentityAccounts, args);
                if (solWallet.signTransaction) {
                    const tx0 = new solana.Transaction().add(ix0);
                    tx0.recentBlockhash = (await rpcCon.getLatestBlockhash()).blockhash;
                    tx0.feePayer = solWallet.publicKey;
                    const signature = await solWallet.sendTransaction(tx0, rpcCon);
                    if (signature) {
                        const txSig = `https://explorer.solana.com/tx/${signature} `;
                        toast.dismiss(id);
                        toast.success(
                            <>
                                <Box>
                                    <p style={{ color: 'black' }}>
                                        Digital Identity has been created Successfully with tx
                                    </p>
                                    <a href={txSig}>Tx</a>
                                </Box>
                            </>
                        );
                    }
                }
            }
        } catch (e) {
            toast.dismiss(id);
            toast.error('Digital identity creation failed');
            console.error(e);
        }
    };
    return (
        <>
            <button style={{ width: 'auto' }} className="balance-button w3-btn w3-hover-white" onClick={handleOpen}>
                Create Identity
            </button>

            <Modal open={open} onClose={handleClose} style={{ width: '100vw', height: '100%' }}>
                <Box className="App">
                    {open && (
                        <Box style={{ width: '100vw', height: '100vh' }}>
                            <Box style={{ backgroundColor: 'black' }}>
                                <button
                                    style={{ backgroundColor: 'transparent', borderColor: 'transparent' }}
                                    onClick={handleClose}
                                >
                                    <CancelIcon style={{ color: 'lightskyblue', fontSize: '50px' }}></CancelIcon>
                                </button>
                            </Box>
                            <Form
                                formId={1987}
                                formObj={{
                                    blocks: [
                                        {
                                            name: 'welcome-screen',
                                            id: 'jg1401r',
                                            attributes: {
                                                label: 'Create your Digital Identity',
                                                description: '',
                                                // attachment: {
                                                //     type: "image",
                                                //     url:
                                                //         "https://quillforms.com/wp-content/uploads/2022/01/4207-ai-1.jpeg"
                                                // },
                                                // attachmentMaxWidth: "300px"
                                            },
                                        },
                                        {
                                            name: 'short-text',
                                            id: 'name',
                                            attributes: {
                                                required: true,
                                                label: 'Enter your Name',
                                            },
                                        },
                                        {
                                            name: 'date',
                                            id: 'DOB',
                                            attributes: {
                                                label: 'Enter your date of birth',
                                                required: true,
                                            },
                                        },
                                        {
                                            id: 'address',
                                            name: 'short-text',
                                            attributes: {
                                                label: 'Your Resedential Address..',
                                                description: 'enter your present address',
                                            },
                                        },
                                        {
                                            id: 'phnum',
                                            name: 'number',
                                            attributes: {
                                                label: 'Enter your phone number',
                                                required: true,
                                            },
                                        },
                                        {
                                            id: '1dsdf12xx',
                                            name: 'group',
                                            attributes: {
                                                label: 'Government_ids',
                                                description: "Enter your valid Id's",
                                            },
                                            innerBlocks: [
                                                {
                                                    name: 'short-text',
                                                    id: 'id_number',
                                                    attributes: {
                                                        required: true,
                                                        label: 'Enter your Aadhar/SSN number or any type of Identity number recognized by government',
                                                        placeholder: 'Enter your identity',
                                                    },
                                                },
                                                {
                                                    name: 'short-text',
                                                    id: 'pan',
                                                    attributes: {
                                                        required: true,
                                                        label: 'Enter your PAN number..',
                                                    },
                                                },
                                                {
                                                    name: 'short-text',
                                                    id: 'passport_id',
                                                    attributes: {
                                                        required: true,
                                                        label: 'Enter your PASSPORT number..',
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                    settings: {
                                        animationDirection: 'vertical',
                                        disableWheelSwiping: false,
                                        disableNavigationArrows: false,
                                        disableProgressBar: false,
                                        showQuestionsNumbers: true,
                                    },
                                    theme: {
                                        font: 'Roboto',
                                        buttonsBgColor: 'lightskyblue',
                                        logo: {
                                            src: '',
                                        },
                                        backgroundColor: 'black',
                                        questionsColor: 'lightskyblue',
                                        answersColor: 'lightskyblue',
                                        buttonsFontColor: 'white',
                                        buttonsBorderRadius: 25,
                                        errorsFontColor: 'lightskyblue',

                                        errorsBgColor: 'black',
                                        progressBarFillColor: 'lightskyblue',
                                        progressBarBgColor: 'lightskyblue',
                                    },
                                }}
                                // beforeGoingNext={async ({ answers, setIsFieldValid, setFieldValidationErr }) => {
                                //     if (answers) {
                                //         console.log(answers);
                                //         switch (answers) {
                                //             case 'name':
                                //                 if (answers['name'].length <= 15) {
                                //                     console.log('inside');
                                //                     setIsFieldValid(answers['name'], false);
                                //                     setFieldValidationErr(
                                //                         answers['name'],
                                //                         'Length of name should be less than 15 chars'
                                //                     );
                                //                 }
                                //                 break;
                                //         }
                                //     }
                                // }}
                                onSubmit={async (data, { completeForm, setIsSubmitting, setSubmissionErr }) => {
                                    // setIsSubmitting(false);
                                    const errors = validateForm(data);
                                    console.log('errors', errors);

                                    if (errors.length > 0) {
                                        errors.map((error) => {
                                            return toast.error((error as string).toString());
                                        });
                                        // handleClose();
                                        // completeForm();
                                        let errorStr = '';
                                        errors.forEach((error) => {
                                            // eslint-disable-next-line no-useless-concat
                                            errorStr = errorStr + error + '\t' + '|' + '\t';
                                        });
                                        console.log(errorStr);
                                        setSubmissionErr(errorStr);
                                    } else {
                                        completeForm();
                                        setOpen(false);

                                        const userData = setUserData(data);
                                        await axios.post('http://localhost:9000/digitalIdentities/add', {
                                            userPubkey: solWallet?.publicKey?.toBase58(),
                                            name: userData.name,
                                        });
                                        const response = await axios.post(
                                            'http://localhost:9000/cryptography/encryptData',
                                            { plainData: userData, ticker: 'solData' }
                                        );

                                        const encUserData = response.data.encryptedData as UserData;

                                        const id = toast.loading('loading');
                                        if (encUserData) {
                                            setTimeout(async () => {
                                                await createIdentity(id, encUserData);
                                            }, 3000);
                                        } else {
                                            toast.dismiss(id);
                                            toast.error('Failed to create Identity');
                                        }
                                    }
                                }}
                                applyLogic={true}
                                isPreview={false}
                            />
                        </Box>
                    )}
                </Box>
            </Modal>
        </>
    );
};
