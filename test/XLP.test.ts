import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { expect } from "chai";
import { Contract, BigNumber } from "ethers";
import { parseEther, formatEther } from "ethers/lib/utils";
import hre, { ethers } from "hardhat";

describe("XLP contract test", () => {
  const DEFAULT_MINT_AMOUNT = 10 ** 8;
  let xlpContract: Contract;
  let AContract: Contract;
  let BContract: Contract;
  let owner: SignerWithAddress, user1: SignerWithAddress;

  const initPool = async (amountA: string, amountB: string) => {
    const [owner, user1] = await ethers.getSigners();
    // mint A, B
    await AContract.connect(owner).mint(parseEther(amountA));
    await BContract.connect(owner).mint(parseEther(amountB));
    // approve A, B for XLP
    await AContract.connect(owner).approve(
      xlpContract.address,
      parseEther(amountA)
    );
    await BContract.connect(owner).approve(
      xlpContract.address,
      parseEther(amountB)
    );
    // add liquidity
    xlpContract
      .connect(owner)
      .addLiquidity(
        parseEther(amountA),
        parseEther(amountB),
        BigNumber.from("0"),
        BigNumber.from("0")
      );
  };

  beforeEach(async () => {
    [owner, user1] = await ethers.getSigners();
    const tokenFactory = await ethers.getContractFactory("Token");
    AContract = await tokenFactory.deploy("A", "A");
    await AContract.deployed();
    BContract = await tokenFactory.deploy("B", "B");
    await BContract.deployed();
    const xlp = await ethers.getContractFactory("XLP");
    xlpContract = await xlp.deploy(AContract.address, BContract.address);
    await initPool("10000", "100");
  });

  it("Init pool with A, B token", async () => {
    // expect XLP token is minted
    const xlpTotalSupply = await xlpContract.totalSupply();
    expect(xlpTotalSupply).to.eq(parseEther(DEFAULT_MINT_AMOUNT + ""));
  });

  it("Increase liquidity pool with A, B token", async () => {
    // increase liquidity
    const increaseAmountA = "500";
    const increaseAmountB = "5";
    // mint A, B
    await AContract.connect(owner).mint(parseEther(increaseAmountA));
    await BContract.connect(owner).mint(parseEther(increaseAmountB));
    // approve A, B for XLP
    await AContract.connect(owner).approve(
      xlpContract.address,
      parseEther(increaseAmountA)
    );
    await BContract.connect(owner).approve(
      xlpContract.address,
      parseEther(increaseAmountB)
    );
    // add liquidity
    await xlpContract
      .connect(owner)
      .addLiquidity(
        parseEther(increaseAmountA),
        parseEther(increaseAmountB),
        BigNumber.from("0"),
        BigNumber.from("0")
      );
    const xlpTotalSupply = await xlpContract.totalSupply();
    // expected XLP totalSupply is increased
    expect(xlpTotalSupply).eq(
      parseEther(DEFAULT_MINT_AMOUNT + (DEFAULT_MINT_AMOUNT * 500) / 10000 + "")
    );
  });

  it("Remove liquidity pool with A, B token", async () => {
    const xlpTotalSupplyBefore = await xlpContract.totalSupply();
    // remove liquidity
    const removeXLP = "1000000";
    const minAmountA = "1"; // min amount of A token in pool
    const minAmountB = "0.1"; //  min amount of B token in pool
    await xlpContract
      .connect(owner)
      .removeLiquidity(
        parseEther(removeXLP),
        parseEther(minAmountA),
        parseEther(minAmountB)
      );
    const xlpTotalSupplyAfter = await xlpContract.totalSupply();
    // expected XLP totalSupply is increased
    expect(xlpTotalSupplyBefore.sub(xlpTotalSupplyAfter)).eq(
      parseEther(removeXLP)
    );
  });

  it("Swap A, B token", async () => {
    const amountIn = "1";
    // (1- slippage) * desiredAmoutOut <= minAmountOut <= desiredAmount
    const minAmountOut = BigNumber.from("1");
    // approve A, B for XLP
    await AContract.connect(owner).approve(
      xlpContract.address,
      parseEther("1000")
    );
    await BContract.connect(owner).approve(
      xlpContract.address,
      parseEther("1000")
    );
    // mint more A, B
    await AContract.connect(owner).mint(parseEther(amountIn));
    const balanceOfABefore = await AContract.balanceOf(owner.address);
    const balanceOfBBefore = await BContract.balanceOf(owner.address);
    const balanceOfBInPool = await BContract.balanceOf(xlpContract.address);

    await xlpContract
      .connect(owner)
      .swap(
        AContract.address,
        BContract.address,
        parseEther(amountIn),
        parseEther("0.0001")
      );

    const balanceOfAAfter = await AContract.balanceOf(owner.address);
    const balanceOfBAfter = await BContract.balanceOf(owner.address);
    const expectAmountOut = balanceOfBInPool.sub(
      parseEther("10000")
        .mul(parseEther("100"))
        .div(parseEther("10000").add(parseEther(amountIn)))
    );
    expect(balanceOfABefore.sub(balanceOfAAfter)).eq(parseEther(amountIn));
    expect(balanceOfBAfter.sub(balanceOfBBefore)).eq(expectAmountOut);
  });
});
