// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IKYCContract {
    function viewMyRequest(uint256 index) external view returns (uint256 level, uint256 status);
    function createKYCRequest(uint256 level, bytes calldata data) external payable;
}