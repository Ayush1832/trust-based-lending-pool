const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with:", deployer.address);

  const usdgAddress = "0xDcE5E14F2A607C049C8948b05AD561C2Ff46D407";
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