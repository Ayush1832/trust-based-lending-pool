// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./interfaces/IKYCContract.sol";
import "./interfaces/IReputationContract.sol";

contract LendingPool is ReentrancyGuard {
    using SafeMath for uint256;

    IERC20 public usdGToken;
    IKYCContract public kycContract;
    IReputationContract public reputationContract;

    uint256 public constant LTV = 50;
    uint256 public constant DEPOSITOR_INTEREST_RATE = 5;
    uint256 public constant MIN_TRUST_SCORE = 40;
    uint256 public constant MIN_KYC_LEVEL = 1;

    mapping(address => uint256) public deposits;
    mapping(address => uint256) public loans;
    mapping(address => uint256) public collateral;

    event Deposited(address indexed user, uint256 amount);
    event Borrowed(address indexed user, uint256 amount);
    event Repaid(address indexed user, uint256 amount);
    event Withdrawn(address indexed user, uint256 amount);

    constructor(address _usdGToken, address _kycContract, address _reputationContract) {
        usdGToken = IERC20(_usdGToken);
        kycContract = IKYCContract(_kycContract);
        reputationContract = IReputationContract(_reputationContract);
    }

    modifier onlyKYCVerified() {
        (uint256 level, uint256 status) = kycContract.viewMyRequest(0);
        require(status == 2, "KYC not approved");
        require(level >= MIN_KYC_LEVEL, "Insufficient KYC level");
        _;
    }

    modifier onlyTrusted() {
        uint256 trustScore = reputationContract.getTrustScore(msg.sender);
        require(trustScore >= MIN_TRUST_SCORE, "Trust Score too low");
        _;
    }

    function deposit(uint256 amount) external nonReentrant onlyKYCVerified {
        require(amount > 0, "Amount must be greater than 0");
        usdGToken.transferFrom(msg.sender, address(this), amount);
        deposits[msg.sender] = deposits[msg.sender].add(amount);
        emit Deposited(msg.sender, amount);
    }

    function borrow(uint256 amount) external nonReentrant onlyKYCVerified onlyTrusted {
        require(amount > 0, "Amount must be greater than 0");
        require(loans[msg.sender] == 0, "Repay existing loan first");

        uint256 trustScore = reputationContract.getTrustScore(msg.sender);
        uint256 trustScoreMaxLoan = getTrustScoreMaxLoan(trustScore);
        uint256 collateralMaxLoan = deposits[msg.sender].mul(LTV).div(100);
        uint256 maxLoan = collateralMaxLoan < trustScoreMaxLoan ? collateralMaxLoan : trustScoreMaxLoan;

        require(amount <= maxLoan, "Amount exceeds borrowing limit");
        loans[msg.sender] = amount;
        collateral[msg.sender] = collateral[msg.sender].add(amount.div(2));
        usdGToken.transfer(msg.sender, amount);
        emit Borrowed(msg.sender, amount);
    }

    function repay() external nonReentrant {
        uint256 loanAmount = loans[msg.sender];
        require(loanAmount > 0, "No loan to repay");

        uint256 trustScore = reputationContract.getTrustScore(msg.sender);
        uint256 interestRate = getInterestRate(trustScore);
        uint256 interest = loanAmount.mul(interestRate).div(100);
        uint256 totalRepayment = loanAmount.add(interest);

        usdGToken.transferFrom(msg.sender, address(this), totalRepayment);
        loans[msg.sender] = 0;
        collateral[msg.sender] = collateral[msg.sender].sub(loanAmount.div(2));
        emit Repaid(msg.sender, totalRepayment);
    }

    function withdraw(uint256 amount) external nonReentrant onlyKYCVerified {
        require(loans[msg.sender] == 0, "Repay loan before withdrawing");
        uint256 deposit = deposits[msg.sender];
        require(amount <= deposit, "Insufficient deposit");

        uint256 interest = deposit.mul(DEPOSITOR_INTEREST_RATE).div(100);
        uint256 totalWithdrawal = amount.add(interest);

        deposits[msg.sender] = deposit.sub(amount);
        usdGToken.transfer(msg.sender, totalWithdrawal);
        emit Withdrawn(msg.sender, totalWithdrawal);
    }

    function getTrustScoreMaxLoan(uint256 trustScore) internal pure returns (uint256) {
        if (trustScore >= 80) return 5000e18;
        if (trustScore >= 60) return 3000e18;
        if (trustScore >= 40) return 1000e18;
        return 0;
    }

    function getInterestRate(uint256 trustScore) internal pure returns (uint256) {
        if (trustScore >= 80) return 6;
        if (trustScore >= 60) return 8;
        return 10;
    }
}