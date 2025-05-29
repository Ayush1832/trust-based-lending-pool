import React from "react";
import { ethers } from "ethers";

const InitiateKYC = ({ account, setError }) => {
  const initiate = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const kycContract = new ethers.Contract(
        "0xYourKYCContractAddress", // Update with actual address
        [
          {
            "inputs": [
              { "internalType": "uint256", "name": "level", "type": "uint256" },
              { "internalType": "bytes", "name": "data", "type": "bytes" }
            ],
            "name": "createKYCRequest",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
          }
        ],
        signer
      );
      const tx = await kycContract.createKYCRequest(1, "0x");
      await tx.wait();
      alert("KYC request initiated");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <button onClick={initiate} className="bg-green-500 text-white p-2 rounded mt-2" disabled={!account}>
      Initiate KYC
    </button>
  );
};

export default InitiateKYC;