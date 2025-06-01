// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IKYCContract {
    function getKYCLevel(address _addr) external view returns (uint256);
}

contract LendingPool is ReentrancyGuard {
    IERC20 public usdGToken;
    IKYCContract public kycContract;

    uint256 public constant LTV = 50;
    uint256 public constant DEPOSITOR_INTEREST_RATE = 5;
    uint256 public constant MIN_KYC_LEVEL = 1;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public loans;
    mapping(address => uint256) public collateral;

    event Deposited(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _usdGToken, address _kycContract) {
        usdGToken = IERC20(_usdGToken);
        kycContract = IKYCContract(_kycContract);
    }

    modifier kycVerified() {
        require(kycContract.getKYCLevel(msg.sender) >= MIN_KYC_LEVEL, "KYC level 1 required");
        _;
    }

    function deposit(uint256 amount) external nonReentrant kycVerified {
        require(amount > 0, "Amount must be greater than 0");
        require(usdGToken.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        deposits[msg.sender] += amount;
        emit Deposited(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant kycVerified {
        require(amount > 0, "Amount must be greater than 0");
        require(loans[msg.sender] == 0, "Repay existing loan first");

        uint256 collateralMaxLoan = deposits[msg.sender] * LTV / 100;
        require(amount <= collateralMaxLoan, "Amount exceeds borrowing limit");

        loans[msg.sender] = amount;
        collateral[msg.sender] += amount / 2;
        require(usdGToken.transfer(msg.sender, amount), "Transfer failed");
        emit Borrowed(msg.sender, amount);
    }

    function repay() external nonReentrant kycVerified {
        uint256 loanAmount = loans[msg.sender];
        require(loanAmount > 0, "No loan to repay");

        uint256 interestRate = 8;
        uint256 interest = loanAmount * interestRate / 100;
        uint256 totalRepayment = loanAmount + interest;

        require(usdGToken.transferFrom(msg.sender, address(this), totalRepayment), "Transfer failed");
        loans[msg.sender] = 0;
        collateral[msg.sender] -= loanAmount / 2;
        emit Repaid(msg.sender, totalRepayment);
    }

    function withdraw(uint256 amount) external nonReentrant kycVerified {
        require(loans[msg.sender] == 0, "Repay loan before withdrawing");
        uint256 userDeposit = deposits[msg.sender];
        require(amount <= userDeposit, "Insufficient deposit");

        uint256 interest = userDeposit * DEPOSITOR_INTEREST_RATE / 100;
        uint256 totalWithdrawal = amount + interest;

        deposits[msg.sender] = userDeposit - amount;
        require(usdGToken.transfer(msg.sender, totalWithdrawal), "Transfer failed");
        emit Withdrawn(msg.sender, totalWithdrawal);
    }
}