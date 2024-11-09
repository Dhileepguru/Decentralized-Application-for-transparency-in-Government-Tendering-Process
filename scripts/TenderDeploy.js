// Import Ethers from Hardhat
const { ethers } = require("hardhat");

// Main deployment function
async function main() {
    console.log("Starting deployment...");

    // Deploy the Tender contract using Ethers.js v6
    const TenderFactory = await ethers.deployContract("Tender");
    console.log("Deploying Tender, please wait...");

    // Wait for the contract deployment to be completed
    await TenderFactory.waitForDeployment();
    console.log("Tender contract deployed at address:", TenderFactory.target);
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });



// 0x5bCf6DfFfd3eE54F9Db23c9ffDc5Eeb073BF0B56