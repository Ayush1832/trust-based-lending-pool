import React, { useState, useEffect } from "react";
import { getContract } from "../utils/web3";
import { ethers } from "ethers";

const Dashboard = ({ web3, account }) => {
  const [trustScore, setTrustScore] = useState(null);
  const [kycLevel, setKycLevel] = useState(null);
  const [depositBalance, setDepositBalance] = useState("0");
  const [loanBalance, setLoanBalance] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      if (web3 && account) {
        try {
          // Mock Trust Score and KYC Level (replace with actual Graphite SDK calls when available)
          setTrustScore(60); // Placeholder
          setKycLevel(1); // Placeholder

          const contract = await getContract();
          const deposit = await contract.deposits(account);
          setDepositBalance(ethers.formatUnits(deposit, 18));
          const loan = await contract.loans(account);
          setLoanBalance(ethers.formatUnits(loan, 18));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [web3, account]);

  return (
    <div className="border p-4 rounded mt-4">
      <h2 className="text-xl font-bold mb-2">Dashboard</h2>
      <p>Account: {account || "Not connected"}</p>
      <p>Trust Score: {trustScore || "N/A"}</p>
      <p>KYC Level: {kycLevel || "Not verified"}</p>
      <p>Deposit Balance: {depositBalance} USD@G</p>
      <p>Loan Balance: {loanBalance} USD@G</p>
    </div>
  );
};

export default Dashboard;