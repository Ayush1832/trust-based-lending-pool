import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-dark-card p-4 flex justify-between items-center shadow-lg">
      <div className="text-neon-blue text-2xl font-bold">LendingPool</div>
      <div className="flex space-x-6">
        <Link
          to="/"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/deposit"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Deposit
        </Link>
        <Link
          to="/borrow"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Borrow
        </Link>
        <Link
          to="/repay"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Repay
        </Link>
        <Link
          to="/withdraw"
          className="text-white hover:text-neon-blue transition-colors"
        >
          Withdraw
        </Link>
      </div>
      <div>
        {account ? (
          <div className="flex items-center space-x-2">
            <span className="text-neon-green">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-neon-blue text-white px-4 py-2 rounded hover:bg-neon-green transition-colors"
          >
            Connect Graphite Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;