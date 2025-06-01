import React, { useState } from "react";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "../utils/constants";

const Repay = ({ account, setError }) => {
  const [amount, setAmount] = useState("");

  const repay = async () => {
    try {
      if (!window.graphite) throw new Error("MetaMask not detected");
      const provider = new ethers.BrowserProvider(window.graphite);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        LENDING_POOL_ADDRESS,
        LENDING_POOL_ABI,
        signer
      );
      const tx = await contract.repay({ value: ethers.parseUnits(amount, 18) });
      await tx.wait();
      alert("Repay successful");
      setAmount("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 min-h-screen flex justify-center items-center"
    >
      <div className="bg-dark-card p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-neon-blue mb-4">Repay</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-dark-bg text-white border border-neon-blue p-2 w-full rounded mb-4"
          placeholder="Amount (USD@G)"
        />
        <button
          onClick={repay}
          className="bg-neon-blue text-white p-2 w-full rounded hover:bg-neon-green transition-colors disabled:opacity-50"
          disabled={!account || !amount}
        >
          Repay
        </button>
      </div>
    </motion.div>
  );
};

export default Repay;
