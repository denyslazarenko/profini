import express, { Express, Request, Response } from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { ethers, utils } from 'ethers';
import { JsonRpcProvider } from '@ethersproject/providers';
import { Wallet } from '@ethersproject/wallet';

dotenv.config();

const PORT = process.env.PORT || 3000;
const app: Express = express();
const provider: JsonRpcProvider = new JsonRpcProvider(
    "https://polygon-mumbai.infura.io/v3/b9bdb6b417c14d7d853913f3a1559e22");

const privateKey = process.env.PRIVATE_KEY || "NaN";
const wallet: Wallet = new Wallet(privateKey, provider);


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
    })
    .catch(err => alert(err));

    res.sendStatus(200);
});

app.listen(PORT, () => console.log(`Running on ${PORT} ⚡`));