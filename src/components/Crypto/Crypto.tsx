import React, { useState } from 'react';
import NodeRSA from 'node-rsa'

const RsaEncryption = () => {
    const [publicKey, setPublicKey] = useState('');
    const [privateKey, setPrivateKey] = useState('');
    const [plaintext, setPlaintext] = useState('');
    const [encryptedText, setEncryptedText] = useState('');
    const [decryptedText, setDecryptedText] = useState('');

    const generateKeys = () => {
        const key = new NodeRSA({ b: 512 }); // Generate a 512-bit key pair (adjust the bit size as per your requirement)

        setPublicKey(key.exportKey('public'));
        setPrivateKey(key.exportKey('private'));
    };

    const encrypt = () => {
        const key = new NodeRSA();
        key.importKey(publicKey, 'public');

        const encrypted = key.encrypt(plaintext, 'base64');
        setEncryptedText(encrypted);
    };

    const decrypt = () => {
        const key = new NodeRSA();
        key.importKey(privateKey, 'private');

        const decrypted = key.decrypt(encryptedText, 'utf8');
        setDecryptedText(decrypted);
    };

    return (
        <div>
            <h2>RSA Encryption and Decryption</h2>

            <button onClick={generateKeys}>Generate Keys</button>

            <div>
                <h3>Public Key</h3>
                <textarea
                    rows={5}
                    cols={50}
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                />
            </div>

            <div>
                <h3>Private Key</h3>
                <textarea
                    rows={5}
                    cols={50}
                    value={privateKey}
                    onChange={(e) => setPrivateKey(e.target.value)}
                />
            </div>

            <div>
                <h3>Plaintext</h3>
                <input
                    type="text"
                    value={plaintext}
                    onChange={(e) => setPlaintext(e.target.value)}
                />
                <button onClick={encrypt}>Encrypt</button>
            </div>

            <div>
                <h3>Encrypted Text</h3>
                <textarea
                    rows={5}
                    cols={50}
                    value={encryptedText}
                    onChange={(e) => setEncryptedText(e.target.value)}
                />
            </div>

            <div>
                <h3>Decrypted Text</h3>
                <textarea
                    rows={5}
                    cols={50}
                    value={decryptedText}
                    onChange={(e) => setDecryptedText(e.target.value)}
                />
                <button onClick={decrypt}>Decrypt</button>
            </div>
        </div>
    );
};

export default RsaEncryption;





function download(content: string, fileName: string, contentType: string) {
    var a = document.createElement("a");
    var file = new Blob([content], { type: contentType });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}