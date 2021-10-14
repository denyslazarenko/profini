import axios from 'axios';
import { ethers, utils } from 'ethers';
import { makeAutoObservable } from 'mobx';
import { CONFIG } from '../config';
import { NFT, AddEthereumChainParameter } from '../types';
import { BOOSTER_ABI } from './boosterAbi';
import { NFT_ABI } from './nftAbi';

const DEV = true;

export class MainStore {
  ethAddress: string | undefined;
  signer: any;
  provider: any;
  nftContractWrite: ethers.Contract | undefined;
  nftContractRead: ethers.Contract | undefined;
  boosterContractRead: ethers.Contract | undefined;
  boosterContractWrite: ethers.Contract | undefined;
  transferModalOpen?: string;
  contractsReady: boolean = false;
  static instance: MainStore;

  constructor() {
    makeAutoObservable(this);
    const metaMaskAvailable = localStorage.getItem('metamaskAvailable');
    console.log(metaMaskAvailable);
    if (metaMaskAvailable) this.loginMetamask();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new MainStore();
    }
    return this.instance;
  }

  setupEventListeners() {
    const boosterFilter = {
      address: CONFIG.BOOSTER_ADDRESS,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        utils.id('DrawPack(address,uint256[])')
      ]
    };

    this.provider.on(boosterFilter, (data: any) => {
      console.log('RECEIVED BOOSTER EVENT DATA', data);
      // do whatever you want here
      // I'm pretty sure this returns a promise, so don't forget to resolve it
    });

    const nftFilter = {
      address: CONFIG.TOKEN_ADDRESS,
      topics: [
        // the name of the event, parnetheses containing the data type of each event, no spaces
        // TransferSingle(address operator, address from, address to, uint256 id, uint256 value)
        utils.id('TransferSingle(address,address,address,uint256,uint256)')
      ]
    };

    this.provider.on(nftFilter, (data: any) => {
      console.log('RECEIVED NFT EVENT DATA', data);
      // do whatever you want here
      // I'm pretty sure this returns a promise, so don't forget to resolve it
    });
  }

  async loginMetamask() {
    const ethereum = (window as any).ethereum;
    console.log('Requesting signer');

    if (!ethereum) {
      console.error('MetaMask not installed');
      return;
    }
    this.provider = new ethers.providers.Web3Provider(ethereum);
    console.log('provider', this.provider);
    this.signer = this.provider.getSigner();
    console.log('signer', this.signer);
    const result = await ethereum.request({ method: 'eth_requestAccounts' });
    console.log('result', result);

    if (result && result.length > 0) {
      this.ethAddress = result[0];
    } else {
      console.error('MetaMask login failed');
    }

    ethereum.on('accountsChanged', (accounts: string[]) => {
      this.ethAddress = accounts[0];
      // Handle the new accounts, or lack thereof.
      // "accounts" will always be an array, but it can be empty.
    });

    ethereum.on('chainChanged', (chainId: string) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      window.location.reload();
    });

    this.setupContracts();

    if (ethereum.networkVersion !== (DEV ? '' : '0x89')) {
      setTimeout(() => this.switchToPolygonNetwork(), 500);
    }

    localStorage.setItem('metamaskAvailable', 'true');
  }

  async setupContracts() {
    const nftAddress = CONFIG.TOKEN_ADDRESS;
    const boosterAddress = CONFIG.BOOSTER_ADDRESS;

    this.nftContractWrite = new ethers.Contract(
      nftAddress,
      NFT_ABI,
      this.signer
    );
    this.nftContractRead = new ethers.Contract(
      nftAddress,
      NFT_ABI,
      this.provider
    );

    this.boosterContractWrite = new ethers.Contract(
      boosterAddress,
      BOOSTER_ABI,
      this.signer
    );
    this.boosterContractRead = new ethers.Contract(
      boosterAddress,
      BOOSTER_ABI,
      this.provider
    );

    this.contractsReady = true;
  }

  async getTokenIds() {
    const ids = await this.nftContractRead?.tokenIds();
    console.log('ids', ids, this.nftContractRead);
    return ids;
  }

  async getTokenURI(id: number) {
    const uri = await this.nftContractRead?.uri(id);
    console.log('URI', uri);
    return uri;
  }

  toGatewayUrl(ipfsUri: string) {
    const gateway = 'https://dweb.link/';
    const url = new URL(String(ipfsUri));
    return url.protocol === 'ipfs:'
      ? new URL(`/ipfs/${url.href.slice('ipfs://'.length)}`, gateway)
      : url;
  }

  async getTokenData(id: number, ipfsUri?: string): Promise<NFT | undefined> {
    try {
      if (!this.signer) return undefined;
      const tokenUri = ipfsUri || (await this.getTokenURI(id));
      console.log('uri', tokenUri);
      const url = await this.toGatewayUrl(tokenUri);
      const data: any = await axios.get(url.href);
      console.log(data);
      const imageUrl = this.toGatewayUrl(data?.data.image).href;
      return { imageUrl, id };
    } catch (e) {
      console.error(e);
      return undefined;
    }
  }

  async switchToPolygonNetwork() {
    const ethereum = (window as any).ethereum;
    if (!ethereum) {
      console.error('MetaMask not installed');
      return;
    }

    const params: [AddEthereumChainParameter] = DEV
      ? [
          {
            chainId: '0x13881',
            chainName: 'Mumbai',
            rpcUrls: [
              // 'https://rpc-mainnet.matic.network/',
              'https://rpc-mumbai.matic.today'
            ],
            nativeCurrency: {
              name: 'Matic Token',
              symbol: 'MATIC',
              decimals: 18
            }
          }
        ]
      : [
          {
            chainId: '0x89',
            chainName: 'Polygon',
            rpcUrls: [
              // 'https://rpc-mainnet.matic.network/',
              'https://rpc-mainnet.maticvigil.com/',
              'https://rpc-mainnet.matic.quiknode.pro'
            ],
            nativeCurrency: {
              name: 'Matic Token',
              symbol: 'MATIC',
              decimals: 18
            }
          }
        ];

    await ethereum.request({
      method: 'wallet_addEthereumChain',
      params
    });
  }

  async buyBooster() {
    console.log('buying booster');
    if (!this.boosterContractWrite)
      throw new Error('Booster contract not ready');

    const transaction = await this.boosterContractWrite.drawPack();
    const result = await transaction.wait();
    console.log('result', result);
  }

  async openTransferModal(id: string) {
    console.log('open transfer modal');
    this.transferModalOpen = id;
  }
}
