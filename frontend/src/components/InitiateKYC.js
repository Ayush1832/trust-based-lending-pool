import React from "react";
import { motion } from "framer-motion";

const InitiateKYC = ({ web3, account, setError }) => {
  const initiate = async () => {
    try {
      if (!web3) throw new Error("Web3 not initialized");
      const uuid = `kyc-uuid-${Math.random().toString(36).slice(2)}`;
      await web3.graphite.createKYCRequest(uuid, 1);
      alert("KYC request initiated");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.button
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      onClick={initiate}
      className="bg-neon-green text-dark-bg px-4 py-2 rounded hover:bg-neon-blue transition-colors disabled:opacity-50 mt-4"
      disabled={!account || !web3}
    >
      Initiate KYC
    </motion.button>
  );
};

export default InitiateKYC;
