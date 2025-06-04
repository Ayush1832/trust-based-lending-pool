import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  initWeb3,
  getKycLevel,
  requestKycLevel,
  checkKycRequestStatus,
  getLastKycRequestIndex,
} from "../utils/web3";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "../utils/constants";

const Dashboard = ({ account, web3, setError }) => {
  const [lendingPool, setLendingPool] = useState(null);
  const [kycLevel, setKycLevel] = useState(null);
  const [kycRequestStatus, setKycRequestStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (!web3 || !account) {
        setError("Connect Graphite Wallet to view dashboard.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Initializing dashboard...");

        // Initialize lending pool contract
        console.log("Creating lending pool contract instance...");
        const poolContract = new web3.eth.Contract(LENDING_POOL_ABI, LENDING_POOL_ADDRESS);
        setLendingPool(poolContract);
        console.log("Lending pool contract initialized.");

        // Fetch KYC level
        console.log("Fetching KYC level...");
        const level = await getKycLevel(web3);
        setKycLevel(level);
        console.log("KYC level fetched:", level);

        // Fetch last KYC request index
        console.log("Fetching last KYC request index...");
        const lastIndex = await getLastKycRequestIndex(web3, account);
        console.log("Last KYC request index:", lastIndex);

        if (lastIndex >= 0) {
          console.log("Fetching KYC request status for index:", lastIndex);
          const status = await checkKycRequestStatus(web3, lastIndex);
          setKycRequestStatus(status);
          console.log("KYC request status:", status);
        }
      } catch (error) {
        console.error("Dashboard initialization error:", error);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [web3, account, setError]);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black flex items-center justify-center">
      <div className="container mx-auto p-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold text-white mb-12 text-center"
        >
          Dashboard
        </motion.h1>
        {loading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-white text-2xl text-center"
          >
            Loading dashboard data...
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-semibold text-white mb-6">Account Details</h2>
              <p className="text-lg text-gray-300 mb-4">
                <span className="font-bold text-neon-blue">Address:</span>{" "}
                {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : "Not connected"}
              </p>
              <p className="text-lg text-gray-300">
                <span className="font-bold text-neon-blue">Network:</span>{" "}
                {web3 ? "Graphite Mainnet" : "Disconnected"}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl"
            >
              <h2 className="text-3xl font-semibold text-white mb-6">KYC Status</h2>
              <p className="text-lg text-gray-300 mb-4">
                <span className="font-bold text-neon-blue">KYC Level:</span>{" "}
                {kycLevel !== null ? kycLevel : "Not available"}
              </p>
              <p className="text-lg text-gray-300 mb-6">
                <span className="font-bold text-neon-blue">KYC Request Status:</span>{" "}
                {kycRequestStatus ? `Status: ${kycRequestStatus.status}` : "No requests"}
              </p>
              <button
                onClick={handleRequestKyc}
                className="px-6 py-3 bg-neon-blue text-white rounded-lg hover:bg-neon-green transition-colors disabled:opacity-50"
                disabled={!account}
              >
                Request KYC Level 1
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;