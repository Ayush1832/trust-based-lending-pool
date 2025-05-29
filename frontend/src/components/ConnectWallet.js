import React, { useState } from "react";
import { initWeb3 } from "../utils/web3";

const ConnectWallet = ({ setAccount, setWeb3, setError }) => {
  const [isConnecting, setIsConnecting] = useState(false);

  const connect = async () => {
    setIsConnecting(true);
    try {
      const web3 = await initWeb3();
      const accounts = await web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error("No accounts found. Please unlock MetaMask.");
      }
      setAccount(accounts[0]);
      setWeb3(web3);
      setError(null); // Clear any previous errors
    } catch (error) {
      setError(error.message);
      console.error("Wallet connection error:", error);
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <button
      onClick={connect}
      className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
      disabled={isConnecting}
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};

export default ConnectWallet;