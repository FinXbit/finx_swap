import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    localmainnet: {
      url: 'http://localhost:8545/',
      accounts: ['dde94897e9e4f787f6360552a4a723d06b0c730da77c30ce2d4cda61f94e187f']
    }
  },
};

export default config;
