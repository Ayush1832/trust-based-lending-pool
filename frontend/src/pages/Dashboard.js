import React, { useState, useEffect } from "react";
import { initWeb3, getKycLevel, requestKycLevel, checkKycRequestStatus, getLastKycRequestIndex } from "../utils/web3";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "../utils/constants";

const Dashboard = () => {
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState("");
  const [lendingPool, setLendingPool] = useState(null);
  const [kycLevel, setKycLevel] = useState(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [borrowAmount, setBorrowAmount] = useState("");
  const [kycRequestStatus, setKycRequestStatus] = useState(null);
  const [error, setError] = useState("");

  const connectWallet = async () => {
    try {
      setError("");
      const web3Instance = await initWeb3();
      setWeb3(web3Instance);

      const account = await window.graphite.getAddress();
      setAccount(account);

      const poolContract = new web3Instance.eth.Contract(LENDING_POOL_ABI, LENDING_POOL_ADDRESS);
      setLendingPool(poolContract);

      const level = await getKycLevel(web3Instance);
      setKycLevel(level);

      const lastIndex = await getLastKycRequestIndex(web3Instance, account);
      if (lastIndex >= 0) {
        const status = await checkKycRequestStatus(web3Instance, lastIndex);
        setKycRequestStatus(status);
      }
    } catch (error) {
      setError(error.message);
      console.error("Connection failed:", error);
    }
  };

  const handleDeposit = async () => {
    if (!lendingPool || !account || kycLevel < 1) {
      setError("Connect Graphite Wallet, complete KYC (level 1+), and try again.");
      return;
    }
    try {
      await lendingPool.methods.deposit(web3.utils.toWei(depositAmount, "ether")).send({ from: account });
      alert("Deposit successful!");
    } catch (error) {
      setError("Deposit failed: " + error.message);
    }
  };

  const handleBorrow = async () => {
    if (!lendingPool || !account || kycLevel < 1) {
      setError("Connect Graphite Wallet, complete KYC (level 1+), and try again.");
      return;
    }
    try {
      await lendingPool.methods.borrow(web3.utils.toWei(borrowAmount, "ether")).send({ from: account });
      alert("Borrow successful!");
    } catch (error) {
      setError("Borrow failed: " + error.message);
    }
  };

  const handleRequestKyc = async () => {
    if (!web3 || !account) {
      setError("Connect Graphite Wallet first.");
      return;
    }
    try {
      const hash = await requestKycLevel(web3, 1);
      alert(`KYC request submitted. Tx hash: ${hash}`);
    } catch (error) {
      setError("KYC request failed: " + error.message);
    }
  };

  return (
    <div>
      <h1>Trust-Based Lending Pool</h1>
      {!account ? (
        <button onClick={connectWallet}>Connect Graphite Wallet</button>
      ) : (
        <p>Account: {account}</p>
      )}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      <p>KYC Level: {kycLevel || "Unknown"}</p>
      <p>KYC Request Status: {kycRequestStatus ? `Status: ${kycRequestStatus.status}` : "No requests"}</p>

      <div>
        <h2>Request KYC</h2>
        <button onClick={handleRequestKyc}>Request KYC Level 1</button>
      </div>

      <div>
        <h2>Deposit</h2>
        <input
          type="text"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
          placeholder="Amount in USD@G"
        />
        <button onClick={handleDeposit}>Deposit</button>
      </div>

      <div>
        <h2>Borrow</h2>
        <input
          type="text"
          value={borrowAmount}
          onChange={(e) => setBorrowAmount(e.target.value)}
          placeholder="Amount in USD@G"
        />
        <button onClick={handleBorrow}>Borrow</button>
      </div>
    </div>
  );
};

export default Dashboard;