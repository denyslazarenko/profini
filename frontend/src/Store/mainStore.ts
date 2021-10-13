import { ethers } from 'ethers';
import { makeAutoObservable } from 'mobx';

export class MainStore {
  ethAddress: string | undefined;
  signer: any;
  static instance: MainStore;

  constructor() {
    makeAutoObservable(this);
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
    const provider = new ethers.providers.Web3Provider(ethereum);
    console.log('provider', provider);
    this.signer = provider.getSigner();
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
  }
}
