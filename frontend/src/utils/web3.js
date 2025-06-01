import Web3 from "web3";

// KYC Contract Address
const KYC_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000001001";

// KYC Contract ABI (partial, extend as needed)
const KYC_CONTRACT_ABI = [
  {
    "name": "createKYCRequest",
    "type": "function",
    "inputs": [
      { "name": "_level", "type": "uint256" },
      { "name": "_data", "type": "bytes32" }
    ],
    "outputs": [],
    "stateMutability": "payable"
  },
  {
    "name": "viewMyRequest",
    "type": "function",
    "inputs": [{ "name": "_senderKYCIndex", "type": "uint256" }],
    "outputs": [
      { "name": "user", "type": "address" },
      { "name": "level", "type": "uint256" },
      { "name": "status", "type": "uint256" },
      { "name": "centre", "type": "address" },
      { "name": "deposit", "type": "uint256" }
    ],
    "stateMutability": "view"
  },
  {
    "name": "getLastGlobalRequestIndexOfAddress",
    "type": "function",
    "inputs": [{ "name": "_addr", "type": "address" }],
    "outputs": [{ "name": "", "type": "int256" }],
    "stateMutability": "view"
  },
  {
    "name": "getKYCLevel",
    "type": "function",
    "inputs": [{ "name": "_addr", "type": "address" }],
    "outputs": [{ "name": "", "type": "uint256" }],
    "stateMutability": "view"
  }
];

/**
 * Initialize Web3 with Graphite Wallet provider
 * @returns {Promise<Web3>} Initialized Web3 instance
 */
export const initWeb3 = async () => {
  // Explicitly check for Graphite Wallet provider
  if (!window.graphite) {
    // Check for MetaMask interference
    if (window.ethereum) {
      throw new Error("MetaMask detected. Please disable MetaMask extension and ensure Graphite Wallet is enabled.");
    }
    throw new Error("Graphite Wallet not detected. Install it from https://docs.atgraphite.com/ecosystem/graphite-wallet or ensure the extension is enabled.");
  }

  const web3 = new Web3(window.graphite);

  try {
    // Request account access
    const account = await window.graphite.enable();
    if (!account) {
      throw new Error("User rejected account access.");
    }

    // Verify testnet
    const activeNetwork = await window.graphite.getActiveNetwork();
    if (activeNetwork !== "testnet") {
      await window.graphite.changeActiveNetwork("testnet");
    }

    console.log(`Connected to testnet with account: ${account}`);
    return web3;
  } catch (error) {
    throw new Error(`Web3 initialization failed: ${error.message}`);
  }
};

/**
 * Get current KYC level
 * @param {Web3} web3 - Initialized Web3 instance
 * @returns {Promise<string|null>} KYC level
 */
export const getKycLevel = async (web3) => {
  try {
    const accountInfo = await window.graphite.getAccountInfo();
    return accountInfo.kycLevel;
  } catch (error) {
    console.error("SDK KYC level fetch failed:", error);
    try {
      const contract = new web3.eth.Contract(KYC_CONTRACT_ABI, KYC_CONTRACT_ADDRESS);
      const account = await window.graphite.getAddress();
      const level = await contract.methods.getKYCLevel(account).call();
      return level.toString();
    } catch (contractError) {
      console.error("Contract KYC level fetch failed:", contractError);
      return null;
    }
  }
};

/**
 * Request a new KYC level
 * @param {Web3} web3 - Initialized Web3 instance
 * @param {number} level - Desired KYC level (1-3)
 * @returns {Promise<string>} Transaction hash
 */
export const requestKycLevel = async (web3, level) => {
  try {
    if (level < 1 || level > 3) {
      throw new Error("KYC level must be between 1 and 3.");
    }
    const hash = await window.graphite.updateKycLevel(level);
    console.log(`KYC request tx hash: ${hash}`);
    return hash;
  } catch (error) {
    throw new Error(`KYC request failed: ${error.message}`);
  }
};

/**
 * Check KYC request status
 * @param {Web3} web3 - Initialized Web3 instance
 * @param {number} senderKYCIndex - KYC request index
 * @returns {Promise<Object>} KYC request details
 */
export const checkKycRequestStatus = async (web3, senderKYCIndex) => {
  try {
    const contract = new web3.eth.Contract(KYC_CONTRACT_ABI, KYC_CONTRACT_ADDRESS);
    const account = await window.graphite.getAddress();
    const request = await contract.methods.viewMyRequest(senderKYCIndex).call({ from: account });
    return {
      user: request.user,
      level: request.level,
      status: request.status,
      centre: request.centre,
      deposit: request.deposit
    };
  } catch (error) {
    throw new Error(`Failed to check KYC status: ${error.message}`);
  }
};

/**
 * Get last KYC request index
 * @param {Web3} web3 - Initialized Web3 instance
 * @param {string} address - User address
 * @returns {Promise<number>} Last request index
 */
export const getLastKycRequestIndex = async (web3, address) => {
  try {
    const contract = new web3.eth.Contract(KYC_CONTRACT_ABI, KYC_CONTRACT_ADDRESS);
    const index = await contract.methods.getLastGlobalRequestIndexOfAddress(address).call();
    return parseInt(index);
  } catch (error) {
    throw new Error(`Failed to get KYC index: ${error.message}`);
  }
};