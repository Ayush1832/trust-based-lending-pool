// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockKYCContract {
  mapping(address => uint256) public kycLevel;
  mapping(address => uint256) public kycStatus;

  function createKYCRequest(uint256 level, bytes calldata) external payable {
    kycLevel[msg.sender] = level;
    kycStatus[msg.sender] = 2; // Approved
  }

  function viewMyRequest(uint256) external view returns (uint256 level, uint256 status) {
    return (kycLevel[msg.sender], kycStatus[msg.sender]);
  }
}