import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.17",  // Specify your desired Solidity version
    settings: {
      optimizer: {
        enabled: true,  // Enable optimizer for gas efficiency
        runs: 200,      // Adjust optimization runs
      },
    },
  },
};

export default config;

