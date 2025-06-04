export const LENDING_POOL_ADDRESS = "0x7F3657f40fd82ca4EC0D6B45699A32E9618b5228"; // Replace after deployment
export const USDG_ADDRESS = "0x6FB3828B424c04ce7Bb9d64F958942C514D47F30"; // From mockUSDGAddress.json
export const KYC_CONTRACT_ADDRESS = "0x0000000000000000000000000000000000001001";

export const LENDING_POOL_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "_usdGToken", "type": "address" },
      { "internalType": "address", "name": "_kycContract", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Borrowed",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Deposited",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Repaid",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "Withdrawn",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "borrow",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "collateral",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "deposit",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "deposits",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "address", "name": "", "type": "address" }
    ],
    "name": "loans",
    "outputs": [
      { "internalType": "uint256", "name": "", "type": "uint256" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "repay",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "usdGToken",
    "outputs": [
      { "internalType": "contract IERC20", "name": "", "type": "address" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "withdraw",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export const KYC_CONTRACT_ABI = [
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