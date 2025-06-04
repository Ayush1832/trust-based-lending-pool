import React, { useState } from "react";
import { motion } from "framer-motion";
import { getKycLevel } from "../utils/web3";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "../utils/constants";

const Withdraw = ({ account, web3, setError }) => {
  const [amount, setAmount] = useState("");

  const withdraw = async () => {
    if (!web3 || !account) {
      setError("Connect Graphite Wallet first.");
      return;
    }
    try {
      const kycLevel = await getKycLevel(web3);
      if (kycLevel < 1) {
        setError("Complete KYC (level 1+) to withdraw.");
        return;
      }
      const contract = new web3.eth.Contract(LENDING_POOL_ABI, LENDING_POOL_ADDRESS);
      await contract.methods
        .withdraw(web3.utils.toWei(amount, "ether"))
        .send({ from: account });
      alert("Withdraw successful!");
      setAmount("");
    } catch (error) {
      setError(`Withdraw failed: ${error.message}`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-blue-900 to-black"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-8 shadow-2xl w-full max-w-md"
      >
        <h2 className="text-3xl font-extrabold text-white mb-6">Withdraw</h2>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="bg-gray-800 text-white border border-neon-blue p-3 w-full rounded-lg mb-6 focus:outline-none focus:ring-2 focus:ring-neon-blue"
          placeholder="Amount (USD@G)"
        />
        <button
          onClick={withdraw}
          className="bg-neon-blue text-white p-3 w-full rounded-lg hover:bg-neon-green transition-colors disabled:opacity-50 text-lg font-semibold"
          disabled={!account || !amount}
        >
          Withdraw
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Withdraw;