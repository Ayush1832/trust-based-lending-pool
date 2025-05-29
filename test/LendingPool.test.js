const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("LendingPool", function () {
  let lendingPool, usdg, kyc, reputation, owner, user;

  beforeEach(async () => {
    [owner, user] = await ethers.getSigners();

    const USDG = await ethers.getContractFactory("MockUSDG");
    usdg = await USDG.deploy();
    await usdg.deployed();

    const KYC = await ethers.getContractFactory("MockKYCContract");
    kyc = await KYC.deploy();
    await kyc.deployed();

    const Reputation = await ethers.getContractFactory("MockReputationContract");
    reputation = await Reputation.deploy();
    await reputation.deployed();

    const LendingPool = await ethers.getContractFactory("LendingPool");
    lendingPool = await LendingPool.deploy(usdg.address, kyc.address, reputation.address);
    await lendingPool.deployed();

    await usdg.transfer(user.address, ethers.utils.parseUnits("10000", 18));
    await usdg.connect(user).approve(lendingPool.address, ethers.utils.parseUnits("10000", 18));
  });

  it("should allow KYC-verified users to deposit", async () => {
    await kyc.connect(user).createKYCRequest(1, "0x");
    await lendingPool.connect(user).deposit(ethers.utils.parseUnits("1000", 18));
    expect(await lendingPool.deposits(user.address)).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("should allow trusted users to borrow", async () => {
    await kyc.connect(user).createKYCRequest(1, "0x");
    await reputation.setTrustScore(user.address, 60);
    await lendingPool.connect(user).deposit(ethers.utils.parseUnits("2000", 18));
    await lendingPool.connect(user).borrow(ethers.utils.parseUnits("1000", 18));
    expect(await lendingPool.loans(user.address)).to.equal(ethers.utils.parseUnits("1000", 18));
  });

  it("should fail for non-KYC users", async () => {
    await expect(lendingPool.connect(user).deposit(ethers.utils.parseUnits("1000", 18)))
      .to.be.revertedWith("KYC not approved");
  });

  it("should fail for low Trust Score", async () => {
    await kyc.connect(user).createKYCRequest(1, "0x");
    await reputation.setTrustScore(user.address, 30);
    await lendingPool.connect(user).deposit(ethers.utils.parseUnits("2000", 18));
    await expect(lendingPool.connect(user).borrow(ethers.utils.parseUnits("1000", 18)))
      .to.be.revertedWith("Trust Score too low");
  });
});