import React from "react";
import { motion } from "framer-motion";

const Home = ({ account }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="flex flex-col items-center justify-center min-h-screen text-center px-4"
    >
      <h1 className="text-5xl font-bold text-neon-blue mb-4">
        Welcome to LendingPool
      </h1>
      <p className="text-xl mb-8 max-w-2xl">
        A decentralized lending platform on Graphite Network. Deposit, borrow,
        and manage your assets with ease and security.
      </p>
      {!account && (
        <p className="text-neon-green">Connect your wallet to get started!</p>
      )}
    </motion.div>
  );
};

export default Home;
