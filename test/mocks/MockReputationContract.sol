// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MockReputationContract {
  mapping(address => uint256) public trustScores;

  function setTrustScore(address user, uint256 score) external {
    trustScores[user] = score;
  }

  function getTrustScore(address user) external view returns (uint256) {
    return trustScores[user];
  }
}