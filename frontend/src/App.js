import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Deposit from "./pages/Deposit";
import Borrow from "./pages/Borrow";
import Repay from "./pages/Repay";
import Withdraw from "./pages/Withdraw";
import { initWeb3 } from "./utils/web3";

const App = () => {
  const [account, setAccount] = useState(null);
  const [web3, setWeb3] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkConnection = async () => {
      if (window.graphite) {
        try {
          const web3Instance = await initWeb3();
          setWeb3(web3Instance);
          const account = await window.graphite.getAddress();
          if (account) {
            setAccount(account);
          }
        } catch (err) {
          setError(err.message || "Failed to initialize Web3");
        }

        // Listen for account changes
        window.graphite.on("accountsChanged", async () => {
          const newAccount = await window.graphite.getAddress();
          setAccount(newAccount || null);
        });

        // Listen for network changes
        window.graphite.on("chainChanged", () => {
          window.location.reload();
        });

        return () => {
          window.graphite.removeAllListeners();
        };
      } else {
        setError("Please connect to Graphite wallet to continue");
      }
    };
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      if (!window.graphite) {
        throw new Error("Graphite Wallet not detected. Install it from https://docs.atgraphite.com/ecosystem/graphite-wallet");
      }
      const web3Instance = await initWeb3();
      setWeb3(web3Instance);
      const account = await window.graphite.getAddress();
      setAccount(account);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setWeb3(null);
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
          <Route
            path="/dashboard"
            element={
              <Dashboard account={account} web3={web3} setError={setError} />
            }
          />
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