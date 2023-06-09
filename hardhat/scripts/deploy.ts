import { ethers } from "hardhat";

async function main() {
  const Forest = await ethers.getContractFactory("Forest");
  const forest = await Forest.deploy();

  await forest.deployed();

  console.log(`Forest deployed to ${forest.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
