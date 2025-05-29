import React from "react";

const ErrorDisplay = ({ error }) => {
  if (!error) return null;
  return (
    <div className="border border-red-500 p-4 rounded mt-4 text-red-500">
      <p>Error: {String(error)}</p>
    </div>
  );
};

export default ErrorDisplay;