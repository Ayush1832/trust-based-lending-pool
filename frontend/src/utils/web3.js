import { ethers } from "ethers";
import Web3 from "web3";
import { LENDING_POOL_ADDRESS, LENDING_POOL_ABI } from "./constants";

export const initWeb3 = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }

  // Initialize Web3 with MetaMask provider
  const web3 = new Web3(window.ethereum);

  // Request account access
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } catch (error) {
    throw new Error(`Failed to connect to MetaMask: ${error.message}`);
  }

  // Attempt to load Graphite plugin (optional, fallback if it fails)
  try {
    const { GraphitePlugin } = await import("@atgraphite/web3-plugin");
    web3.registerPlugin(new GraphitePlugin(web3));
  } catch (error) {
    console.warn("Graphite plugin failed to load:", error.message);
    // Continue without Graphite plugin for basic functionality
  }

  return web3;
};

export const getContract = async () => {
  if (!window.ethereum) {
    throw new Error("MetaMask not detected. Please install MetaMask.");
  }
  const provider = new ethers.BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();
  return new ethers.Contract(LENDING_POOL_ADDRESS, LENDING_POOL_ABI, signer);
};