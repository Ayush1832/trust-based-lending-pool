import React from "react";
import { motion } from "framer-motion";

const Home = ({ account }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-900 to-black"
    >
      <div className="text-center px-4">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-white mb-6"
        >
          Welcome to LendingPool
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-lg md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto"
        >
          A decentralized lending platform on Graphite Network. Deposit, borrow, and manage your assets with ease and security.
        </motion.p>
        {!account && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="px-8 py-4 bg-neon-blue text-white rounded-lg hover:bg-neon-green transition-colors text-lg font-semibold"
          >
            Connect Graphite Wallet
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default Home;