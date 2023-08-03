import { ethers } from "hardhat";

async function main() {
  const testFixToken = await ethers.deployContract("FixSwap", ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0x5FbDB2315678afecb367f032d93F642f64180aa3"] );

  await testFixToken.waitForDeployment();

  console.log(
    `Contract testFixToken deployed to ${testFixToken.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
