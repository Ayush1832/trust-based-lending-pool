const { ethers } = require("hardhat");
const { saveContractAddress } = require("./utils/deployUtils");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const USDG = await ethers.getContractFactory("MockUSDG");
  const usdg = await USDG.deploy();
  await usdg.deployed();
  saveContractAddress("USDG", usdg.address);

  const KYC = await ethers.getContractFactory("MockKYCContract");
  const kyc = await KYC.deploy();
  await kyc.deployed();
  saveContractAddress("KYCContract", kyc.address);

  const Reputation = await ethers.getContractFactory("MockReputationContract");
  const reputation = await Reputation.deploy();
  await reputation.deployed();
  saveContractAddress("ReputationContract", reputation.address);

  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(usdg.address, kyc.address, reputation.address);
  await lendingPool.deployed();
  saveContractAddress("LendingPool", lendingPool.address);

  console.log("Deployed USDG:", usdg.address);
  console.log("Deployed KYCContract:", kyc.address);
  console.log("Deployed ReputationContract:", reputation.address);
  console.log("Deployed LendingPool:", lendingPool.address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});