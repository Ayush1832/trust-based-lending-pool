import React, { useState } from "react";
import { getContract } from "../utils/web3";
import { ethers } from "ethers";

const Withdraw = ({ account, setError }) => {
  const [amount, setAmount] = useState("");

  const withdraw = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.withdraw(ethers.parseUnits(amount, 18));
      await tx.wait();
      alert("Withdraw successful");
      setAmount("");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="border p-4 rounded">
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="border p-2 mr-2 w-full"
        placeholder="Withdraw Amount (USD@G)"
      />
      <button onClick={withdraw} className="bg-blue-500 text-white p-2 rounded mt-2 w-full" disabled={!account || !amount}>
        Withdraw
      </button>
    </div>
  );
};

export default Withdraw;