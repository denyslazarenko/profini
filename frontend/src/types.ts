export interface NFT {
  name: string;
  imageUrlOriginal: string;
  tokenId: string;
  description: string;
  owner: string;
  creator: string;
  price: number;
  buyOrder: any;
  sold: boolean;
  soldFor: number | undefined;
  openSeaUrl: string;
  raw: any;
}