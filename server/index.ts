import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { NFT_ABI } from './nftAbi';
import { ethers, utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';

dotenv.config();

const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS || "NaN";
const PRIVATE_KEY = process.env.PRIVATE_KEY || "NaN";
const PORT = process.env.PORT || 3000;
const app: Express = express();
const provider: JsonRpcProvider = new JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/b9bdb6b417c14d7d853913f3a1559e22");

const wallet: Wallet = new Wallet(PRIVATE_KEY, provider);
const contract = new ethers.Contract(CONTRACT_ADDRESS, NFT_ABI, provider);

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/:addr', (req: Request, res: Response) => {
    const receiveAddr = req.params.addr;
    let tx = {
        to: receiveAddr,
        value: utils.parseEther('0.0001')
    };

    let sendPromise = wallet.sendTransaction(tx);
    sendPromise
    .then((tx) => {
        console.log(tx);
        res.sendStatus(200);
    })
    .catch(err => console.log(err));
});

app.get('/contract/tokenIDs', (req: Request, res: Response) => {
    let tokenPromise = contract.tokenIDs();
    tokenPromise
    .then((value: any) => {
        console.log(value);
        res.send(value);
    })
    .catch((err: any) => console.log(err));

});

app.get('/contract/uris', (req: Request, res: Response) => {
    let urisPromise = contract.uris();
    urisPromise
    .then((value: any) => {
        console.log(value);
        res.send(value);
    })
    .catch((err: any) => console.log(err));
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));