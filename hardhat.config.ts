import "@nomiclabs/hardhat-waffle";
import "@nomiclabs/hardhat-etherscan";
import "hardhat-deploy";
import "hardhat-deploy-ethers";
import "@openzeppelin/hardhat-upgrades";

import { HardhatUserConfig } from "hardhat/types";

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
      rinkeby: {
          url: process.env.WEB3_PROVIDER,
          chainId: 4,
          accounts: [process.env.PRIVATE_KEY]
      }
  },
  namedAccounts: {
      deployer: 0
  },
  etherscan: {
      apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config;

