import { autorun } from 'mobx';
import { useEffect, useState } from 'react';
import { MainStore } from '../Store/mainStore';

export const useOwnNFTs = () => {
  const [ownNfts, setOwnNfts] = useState<{ [id: string]: number }>({});
  const mainStore = MainStore.getInstance();

  useEffect(() => {
    autorun(async () => {
      console.log('Contracts ready', mainStore.contractsReady);
      if (!mainStore.contractsReady) return;
      const ownNfts = (await mainStore.getOwnTokens()) || {};
      setOwnNfts(ownNfts);
    });
  }, []);

  return ownNfts;
};
