import os from 'os';
const home = os.homedir();

export const getKeypairPath = ():string=>{
    return `${home}/RSA/keypair.json`;
}