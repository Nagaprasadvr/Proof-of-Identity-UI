import crypto from 'crypto';
import base58 from 'bs58'
import bs16 from 'bs58'
// Generate an asymmetric key pair
export const generateAsymmetricKeyPair = () => {
  return crypto.generateKeyPairSync('rsa', {
    modulusLength: 1028, // Adjust the modulus length as per your requirement
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem',
    },
  });
};

// Encrypt data using the public key
export const encryptData = (data:string, publicKey:crypto.RsaPublicKey| string) => {
  const encryptedBuffer = crypto.publicEncrypt(publicKey, Buffer.from(data));
  return encryptedBuffer.toString('base64');
};

// Decrypt data using the private key
export const decryptData = (encryptedData:string, privateKey:crypto.RsaPrivateKey| string) => {
  
  const decryptedBuffer = crypto.privateDecrypt(privateKey, Buffer.from(encryptedData, 'base64'))
  return decryptedBuffer.toString('utf8');
};

