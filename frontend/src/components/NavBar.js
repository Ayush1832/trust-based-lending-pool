import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ account, connectWallet, disconnectWallet }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-gray-900 p-4 flex justify-between items-center shadow-lg z-10">
      <div className="text-white text-2xl font-bold">LendingPool</div>
      <div className="flex space-x-6">
        <Link
          to="/"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Home
        </Link>
        <Link
          to="/dashboard"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Dashboard
        </Link>
        <Link
          to="/deposit"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Deposit
        </Link>
        <Link
          to="/borrow"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Borrow
        </Link>
        <Link
          to="/repay"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Repay
        </Link>
        <Link
          to="/withdraw"
          className="text-white hover:text-blue-400 transition-colors"
        >
          Withdraw
        </Link>
      </div>
      <div>
        {account ? (
          <div className="flex items-center space-x-2">
            <span className="text-green-400">
              {account.slice(0, 6)}...{account.slice(-4)}
            </span>
            <button
              onClick={disconnectWallet}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Connect Graphite Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
