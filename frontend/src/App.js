import React, { useState, useEffect } from "react";
import ConnectWallet from "./components/ConnectWallet";
import InitiateKYC from "./components/InitiateKYC";
import Deposit from "./components/Deposit";
import Borrow from "./components/Borrow";
import Repay from "./components/Repay";
import Withdraw from "./components/Withdraw";
import Dashboard from "./components/Dashboard";
import ErrorDisplay from "./components/ErrorDisplay";
import { initWeb3 } from "./utils/web3";

const App = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (window.ethereum) {
      initWeb3()
        .then((web3Instance) => {
          setWeb3(web3Instance);
          web3Instance.eth.getAccounts().then((accounts) => {
            if (accounts.length > 0) setAccount(accounts[0]);
          });
        })
        .catch((err) => setError(err.message || "Failed to initialize Web3"));

      // Handle account changes
      window.ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0] || null);
      });

      // Handle chain changes (optional)
      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });

      return () => {
        window.ethereum.removeAllListeners();
      };
    } else {
      setError("Please install MetaMask");
    }
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Trust-Based Lending Pool</h1>
      <ConnectWallet setAccount={setAccount} setWeb3={setWeb3} setError={setError} />
      <InitiateKYC account={account} setError={setError} />
      <Dashboard web3={web3} account={account} />
      <div className="grid grid-cols-2 gap-4 mt-4">
        <Deposit account={account} setError={setError} />
        <Borrow account={account} setError={setError} />
        <Repay account={account} setError={setError} />
        <Withdraw account={account} setError={setError} />
      </div>
      <ErrorDisplay error={error} />
    </div>
  );
};

export default App;