import { ethers } from "hardhat";

const busdAddress = "";
const fixAddress = "";

async function main() {
  const fixSwap = await ethers.deployContract("FixSwap", [busdAddress, fixAddress] );

  await fixSwap.waitForDeployment();

  console.log(
    `Contract FixSwap deployed to ${fixSwap.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
