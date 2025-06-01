const { ethers } = require("hardhat");
const fs = require("fs");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying MockUSDG with:", deployer.address);

  const MockUSDG = await ethers.getContractFactory("MockUSDG");
  const mockUSDG = await MockUSDG.deploy();
  await mockUSDG.waitForDeployment();

  const mockUSDGAddress = await mockUSDG.getAddress();
  console.log("Deployed MockUSDG:", mockUSDGAddress);

  // Save address
  const addresses = { MockUSDG: mockUSDGAddress };
  fs.writeFileSync("mockUSDGAddress.json", JSON.stringify(addresses, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});