require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.20",
  networks: {
    graphiteMainnet: {
      url: "https://mainnet.atgraphite.com", // Replace with actual RPC URL
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};