import React from "react";
import { getContract } from "../utils/web3";

const Repay = ({ account, setError }) => {
  const repay = async () => {
    try {
      const contract = await getContract();
      const tx = await contract.repay();
      await tx.wait();
      alert("Repay successful");
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="border p-4 rounded">
      <button onClick={repay} className="bg-blue-500 text-white p-2 rounded w-full" disabled={!account}>
        Repay Loan
      </button>
    </div>
  );
};

export default Repay;