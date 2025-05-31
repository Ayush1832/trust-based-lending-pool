const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const usdgAddress = "0x..."; // Replace with actual USDG address
  const kycContractAddress = "0x..."; // Replace with actual KYCContract address
  const reputationContractAddress = "0x..."; // Replace with actual ReputationContract address

  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(usdgAddress, kycContractAddress, reputationContractAddress);
  await lendingPool.deployed();

  console.log("Deployed LendingPool:", lendingPool.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});