import { ethers } from "hardhat";

async function main() {
  const testBusdToken = await ethers.deployContract("FixSwap", ["0x5FbDB2315678afecb367f032d93F642f64180aa3", "0x5FbDB2315678afecb367f032d93F642f64180aa3"] );

  await testBusdToken.waitForDeployment();

  console.log(
    `Contract testBusdToken deployed to ${testBusdToken.target}`
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
