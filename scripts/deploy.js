const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const usdgAddress = "0x6FB3828B424c04ce7Bb9d64F958942C514D47F30";
  const kycContractAddress = "0x0000000000000000000000000000000000001001";

  const LendingPool = await ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(usdgAddress, kycContractAddress);
  await lendingPool.waitForDeployment();

  const lendingPoolAddress = await lendingPool.getAddress();
  console.log("Deployed LendingPool:", lendingPoolAddress);

  // Save addresses
  const addresses = {
    LendingPool: lendingPoolAddress,
    USDG: usdgAddress,
    KYCContract: kycContractAddress
  };
  fs.writeFileSync("contractAddresses.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});