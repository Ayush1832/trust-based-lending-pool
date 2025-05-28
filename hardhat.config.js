require("@nomiclabs/hardhat-ethers");
require("@nomiclabs/hardhat-waffle");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    graphiteTestnet: {
      url: process.env.GRAPHITE_TESTNET_URL || "https://testnet.atgraphite.com",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};