import {
    time,
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
//   import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
  import { expect} from "chai";
  import { ethers } from "hardhat";

  describe('Fix Swap unit test cases', function() {

    async function deployTestBusdAndTestFix(){
        const testBusd = await ethers.getContractFactory("BUSD");
        const testFix = await ethers.getContractFactory("FIXTOKEN");

        const [busdAddress, fixAddress] = await Promise.all([
            testBusd.deploy(),
            testFix.deploy()
        ])

        // if(busdAddress?.target && fixAddress?.target){
            return {
                busd: busdAddress, 
                fix: fixAddress
            }
        // }
    }
    async function deployFixSwap() { 
        const FixSwap = await ethers.getContractFactory("FixSwap");
        //Deploy and get the contract address of BUSD and FIX token
        const { busd, fix } = await deployTestBusdAndTestFix();
        //Deploy fixSwap
        const fixSwap = await FixSwap.deploy(busd?.target, fix?.target);
        // Contracts are deployed using the first signer/account by default
        const [owner, otherAccount] = await ethers.getSigners();
        return {
            fixSwap, 
            busd, 
            fix,
            owner,
            otherAccount
        };
    }

    describe("Deployment", function () {
        it("Should deploy the fix swap contract", async function () {
            const { fixSwap, busd, fix, owner, otherAccount} = await loadFixture(deployFixSwap);
         
            //Transfer 100 FIX token to fixSwap
            await fix.transfer(fixSwap?.target, '100000000000000000000');
            //Get the fix balance of fix swap
            const fixBalanceOfFixSwap = await fix.balanceOf(fixSwap?.target);
            expect(fixBalanceOfFixSwap).equal('100000000000000000000');

            //transfer 1000 BUSD to  otherAccount
            await busd.transfer(otherAccount?.address, '1000000000000000000000');

            const ownerBalanceBusd = await busd.balanceOf(owner?.address);
            const otherAccountBalanceBusd = await busd.balanceOf(otherAccount?.address);

            expect(ownerBalanceBusd).equal('999000000000000000000000');
            expect(otherAccountBalanceBusd).equal('1000000000000000000000');

            //approve fixSwap to transfer BUSD from other account
            await busd.connect(otherAccount).approve(fixSwap?.target, '10000000000000000000');
            const getBUSDApprovalForFixSwap = await busd.allowance(otherAccount?.address, fixSwap?.target);
            expect(getBUSDApprovalForFixSwap).equal('10000000000000000000');

            // check fix token balance of other account
            const fixBalanceOfOtherAccountBeforeSwap = await fix.balanceOf(otherAccount?.address);

            expect(fixBalanceOfOtherAccountBeforeSwap).equal('0');


            //console.log all observation before performing the final swap.
            console.log("..............Values Before Swap...............");
            console.log("Fix Swap FIX token Balance", fixBalanceOfFixSwap);
            console.log("Fix Swap BUSD token Allowance", getBUSDApprovalForFixSwap);
            console.log("another Account Balance in BUSD", otherAccountBalanceBusd);
            console.log("Fix Balance of other account before swap", fixBalanceOfOtherAccountBeforeSwap);
            console.log("Owner Balance BUSD after token transfer to other account", ownerBalanceBusd);

            //Perform the Swap 

            await fixSwap.connect(otherAccount).swap('10000000000000000000');


            const fixBalanceOfFixSwapAfterPerformingSwap = await fix.balanceOf(fixSwap?.target);
            const busdApprovalForFixSwapAfterPerformingSwap = await busd.allowance(otherAccount, fixSwap?.target);
            const otherAccountBalanceInBusdAfterPerformingSwap = await busd.balanceOf(otherAccount);
            const fixBalanceOfOtherAccountAfterSwap = await fix.balanceOf(otherAccount?.address);
            const ownerBalanceInBUSDAfterPerformingSwap = await busd.balanceOf(owner);

            console.log("..............Values After Swap...............")
            console.log("Fix Swap FIX token Balance", fixBalanceOfFixSwapAfterPerformingSwap);
            console.log("Fix Swap BUSD token Allowance", busdApprovalForFixSwapAfterPerformingSwap);
            console.log("another Account Balance in BUSD", otherAccountBalanceInBusdAfterPerformingSwap);
            console.log("Fix Balance of other account after swap", fixBalanceOfOtherAccountAfterSwap);
            console.log("Owner Balance BUSD after token transfer to other account", ownerBalanceInBUSDAfterPerformingSwap);


            expect(await fix.balanceOf(fixSwap?.target)).equal(fixBalanceOfFixSwap - BigInt(10000000000000000000));
            expect(await busd.allowance(otherAccount?.address, fixSwap?.target)).equal('0');
            expect(await busd.balanceOf(otherAccount)).equal(otherAccountBalanceBusd - BigInt(10000000000000000000));
            expect(await fix.balanceOf(otherAccount)).equal(fixBalanceOfOtherAccountBeforeSwap + BigInt(10000000000000000000));
            expect(await busd.balanceOf(owner?.address)).equal(ownerBalanceBusd + BigInt(10000000000000000000))

        });
    })
})