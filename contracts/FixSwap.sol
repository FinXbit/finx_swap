// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

//ERC20 Interface 
interface IERC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 value) external returns (bool);
}

// Contract for FIX token swap using binance USD
contract FixSwap {
    uint256 public fixPricePerBUSD;
    address public owner;
    
    modifier onlyOwner {
      require(msg.sender == owner, "Caller is not owner");
      _;
    }

    event TokensSwapped(address indexed user, uint256 amountTokenA, uint256 amountTokenB);
    
    IERC20 public busd;
    IERC20 public fix;

    constructor(address _busdAddress, address _fixAddress) {
       busd = IERC20(_busdAddress);
       fix = IERC20(_fixAddress);        
       fixPricePerBUSD = 1000000000000000000; // Initial swap rate: 1 BUSD  = 1 FIX
       owner = msg.sender; // Contract owner
    }


    // Swap function to exchange Tokens BUSD=>FIX
    function swap(uint256 amountBUSD) public  {
        require(amountBUSD > 0, "BUSD amount must be greater than zero");

        uint256 userBUSDBalance = busd.balanceOf(msg.sender);
        require(userBUSDBalance >= amountBUSD, "BUSD balance exceeds swap amount");

        uint256 amountFix = amountBUSD * fixPricePerBUSD / 10 ** 18;

        require(fix.balanceOf(address(this)) >= amountFix, "Private Sale Ended, insuffient funds inside contract");

        // Transfer USD  from the user to Owner address
        require(busd.transferFrom(msg.sender, payable(owner), amountBUSD), "Token transfer failed");

        // Transfer Token FIX from this contract to the user
        require(fix.transfer(msg.sender, amountFix), "BUSD => FIX, swap fail");

        emit TokensSwapped(msg.sender, amountBUSD, amountFix);
    }

    // Function to change the swap rate (price) of Token A to Token B
    function fixPricePerUSD(uint256 newPrice) public onlyOwner {
        require(newPrice > 0, "New price must be greater than zero");
        fixPricePerBUSD = newPrice;
    }

    // Function to assign new owner
    function reassignOwner(address _owner) public onlyOwner returns(bool){
        owner = _owner;
        return true;
    }
}
