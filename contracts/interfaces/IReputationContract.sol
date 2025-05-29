// SPDX-License-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IReputationContract {
    function getTrustScore(address user) external view returns (uint256);
}