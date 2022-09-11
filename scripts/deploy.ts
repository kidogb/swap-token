import { ethers } from "hardhat";

async function main() {
  // Deploy Token
  const tokenFactory = await ethers.getContractFactory("Token");

  const tokenA = await tokenFactory.deploy("A", "A");
  await tokenA.deployed();
  console.log(`Token A deployed to ${tokenA.address}`);

  const tokenB = await tokenFactory.deploy("B", "B");
  await tokenB.deployed();
  console.log(`Token B deployed to ${tokenB.address}`);

  //Deploy XLP
  const xlpFactory = await ethers.getContractFactory("XLP");
  const tokenXlp = await xlpFactory.deploy(tokenA.address, tokenB.address);
  // const tokenXlp = await xlpFactory.deploy('0x3388965802781fF73De53180A54Ac520ab996B55', '0x81701263bA017a9D5F180b2e953d924F17640A54');
  await tokenXlp.deployed();
  console.log(`Token XLP deployed to ${tokenXlp.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
