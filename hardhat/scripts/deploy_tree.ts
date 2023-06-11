import { ethers } from "hardhat";

async function main() {
  const Tree = await ethers.getContractFactory("Tree");
  const tree = await Tree.deploy(+process.env.CHAINLINK_VRF_SUBSCRIPTION_ID!);

  await tree.deployed();

  console.log(`Tree deployed to ${tree.address}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
