import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  defaultNetwork: "testnet",
  networks: {
    testnet: {
      url: process.env.RPC_URL,
      accounts: [process.env.PRIVATE_KEY!],
      timeout: 100_000
    }
  }
};

export default config;
