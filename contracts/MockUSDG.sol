// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MockUSDG is ERC20 {
  constructor() ERC20("USD Graphite", "USD@G") {
    _mint(msg.sender, 1000000e18); // 1M tokens
  }
}