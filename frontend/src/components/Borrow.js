import React, { useState } from "react";
import { getContract } from "../utils/web3";
import { ethers } from "ethers";

const Borrow = ({ account, setError }) => {
  const [amount, setAmount] = useState("");

  const borrow = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.borrow(ethers.parseUnits(amount, 18));
      await tx.wait();
      alert("Borrow successful");
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
        placeholder="Borrow Amount (USD@G)"
      />
      <button onClick={borrow} className="bg-blue-500 text-white p-2 rounded mt-2 w-full" disabled={!account || !amount}>
        Borrow
      </button>
    </div>
  );
};

export default Borrow;