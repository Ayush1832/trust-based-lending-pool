import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI, KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, REPUTATION_CONTRACT_ADDRESS, REPUTATION_CONTRACT_ABI } from "../utils/constants";

const Dashboard = ({ account }) => {
  const [trustScore, setTrustScore] = useState(null);
  const [kycLevel, setKycLevel] = useState(null);
  const [depositBalance, setDepositBalance] = useState("0");
  const [loanBalance, setLoanBalance] = useState("0");

  useEffect(() => {
    const fetchData = async () => {
      if (account) {
        try {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const reputationContract = new ethers.Contract(REPUTATION_CONTRACT_ADDRESS, REPUTATION_CONTRACT_ABI, provider);
          const kycContract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, provider);
          const lendingPoolContract = new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, provider);

          const trustScore = await reputationContract.getTrustScore(account);
          setTrustScore(trustScore.toString());

          const [level] = await kycContract.viewMyRequest(0).catch(() => [null]);
          setKycLevel(level?.toString() || null);

          const deposit = await lendingPoolContract.deposits(account);
          setDepositBalance(ethers.formatUnits(deposit, 18));
          const loan = await lendingPoolContract.loans(account);
          setLoanBalance(ethers.formatUnits(loan, 18));
        } catch (error) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [account]);

  const initiateKYC = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const kycContract = new ethers.Contract(KYC_CONTRACT_ADDRESS, KYC_CONTRACT_ABI, signer);
      const tx = await kycContract.createKYCRequest(1, "0x");
      await tx.wait();
      const [level] = await kycContract.viewMyRequest(0);
      setKycLevel(level.toString());
      alert("KYC request initiated");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-8 min-h-screen">
      <h2 className="text-3xl font-bold text-neon-blue mb-6">Dashboard</h2>
      {!account ? (
        <p className="text-center text-neon-green">Please connect your wallet to view your dashboard.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-dark-card p-6 rounded-lg shadow-lg">
            <p className="text-neon-blue">Trust Score</p>
            <p className="text-2xl">{trustScore || "N/A"}</p>
          </div>
          <div className="bg-dark-card p-6 rounded-lg shadow-lg">
            <p className="text-neon-blue">KYC Level</p>
            <p className="text-2xl">{kycLevel || "Not Verified"}</p>
            {!kycLevel && (
              <button onClick={initiateKYC} className="mt-4 bg-neon-green text-dark-bg px-4 py-2 rounded hover:bg-neon-blue transition-colors">
                Initiate KYC
              </button>
            )}
          </div>
          <div className="bg-dark-card p-6 rounded-lg shadow-lg">
            <p className="text-neon-blue">Deposit Balance</p>
            <p className="text-2xl">{depositBalance} USD@G</p>
          </div>
          <div className="bg-dark-card p-6 rounded-lg shadow-lg">
            <p className="text-neon-blue">Loan Balance</p>
            <p className="text-2xl">{loanBalance} USD@G</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;