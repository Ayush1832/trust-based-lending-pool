import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ethers } from "ethers";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Borrow from "./pages/Borrow";
import Repay from "./pages/Repay";
import Withdraw from "./pages/Withdraw";

const App = () => {
  const [account, setAccount] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.listAccounts();
        if (accounts.length > 0) {
          setAccount(accounts[0].address);
        }
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.ethereum) throw new Error("MetaMask not detected");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <Router>
      <NavBar
        account={account}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
      />
      <div className="pt-16">
        <Routes>
          <Route path="/" element={<Home account={account} />} />
          <Route path="/dashboard" element={<Dashboard account={account} />} />
          <Route
            path="/deposit"
            element={<Deposit account={account} setError={setError} />}
          />
          <Route
            path="/borrow"
            element={<Borrow account={account} setError={setError} />}
          />
          <Route
            path="/repay"
            element={<Repay account={account} setError={setError} />}
          />
          <Route
            path="/withdraw"
            element={<Withdraw account={account} setError={setError} />}
          />
        </Routes>
      </div>
      {error && (
        <div className="fixed bottom-4 left-4 bg-red-500 text-white p-2 rounded">
          {error}
        </div>
      )}
    </Router>
  );
};

export default App;
