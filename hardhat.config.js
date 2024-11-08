require("@nomicfoundation/hardhat-toolbox");
// require("@nomicfoundation/hardhat-verify");
require("dotenv").config();
require("./tasks/block-number");
require("hardhat-gas-reporter")

/** @type import('hardhat/config').HardhatUserConfig */


const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;
const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;

module.exports = {
  defaultNetwork:"hardhat",
  networks:{
    sepolia : {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId : 11155111, 
    },
    localhost : {
      url : "http://127.0.0.1:8545/",
      chainId : 31337,
    }
  },
  solidity: "0.8.27",
  gasReporter : {
    enabled : true,
    outputFile: "gas-report.txt",
    noColors: true,
    currency : "USD",
    coinmarketcap: COINMARKETCAP_API_KEY,
    // token: "MATIC",
  }
};
