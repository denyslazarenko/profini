async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const BoosterPacks = await ethers.getContractFactory("BoosterPacks");
  const boosterPacks = await BoosterPacks.deploy("0xD8bEB76E402C57c0F992300876102fD0a30E3141");

  console.log("BoosterPacks address:", boosterPacks.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });