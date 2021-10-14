import axios from 'axios';
import { ethers } from 'ethers';
import { makeAutoObservable } from 'mobx';
import { NFTStorage } from 'nft.storage';
import { CONFIG } from '../config';
import { NFT, AddEthereumChainParameter } from '../types';
import { NFT_ABI } from './contractAbi';

export class MainStore {
  ethAddress: string | undefined;
  signer: any;
  provider: any;
  nftContractWrite: ethers.Contract | undefined;
  nftContractRead: ethers.Contract | undefined;
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

    if (ethereum.networkVersion !== '0x89') {
      setTimeout(() => this.switchToPolygonNetwork(), 500);
    }

    localStorage.setItem('metamaskAvailable', 'true');
  }

  async setupContracts() {
    const address = CONFIG.TOKEN_ADDRESS;
    const abi = NFT_ABI;

    this.nftContractWrite = new ethers.Contract(address, abi, this.signer);
    this.nftContractRead = new ethers.Contract(address, abi, this.provider);
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

    const params: [AddEthereumChainParameter] = [
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
}
