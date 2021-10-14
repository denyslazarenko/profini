async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Profini = await ethers.getContractFactory("Profini");
  const profini = await Profini.deploy();
  console.log("Profini address:", profini.address);

  // ==================================================================

  const BoosterPacks = await ethers.getContractFactory("BoosterPacks");
  const boosterPacks = await BoosterPacks.deploy(profini.address);
  console.log("BoosterPacks address:", boosterPacks.address);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });