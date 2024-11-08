// Import Ethers from Hardhat
const { ethers } = require("hardhat");

// Main deployment function
async function main() {
    console.log("Starting deployment...");

    // Deploy the contract using Ethers.js v6
    const SimpleStorageFactory = await ethers.deployContract("SimpleStorage");
    console.log("Deploying SimpleStorage, please wait...");

    // Wait for the contract deployment to be completed
    await SimpleStorageFactory.waitForDeployment();
    console.log("Contract deployed at address:", SimpleStorageFactory.target);

    // Retrieve the initial value of `favoriteNumber`
    try {
        const currentFavNumber = await SimpleStorageFactory.retrieve();
        console.log(`Current Favorite Number: ${currentFavNumber.toString()}`);
    } catch (error) {
        console.error("Error retrieving the initial favorite number:", error);
    }

    // Store a new value and wait for transaction confirmation
    try {
        const txResponse = await SimpleStorageFactory.store(7);
        await txResponse.wait(); // Wait for the transaction to be mined
        console.log("Transaction to store new number completed.");

        const updatedNum = await SimpleStorageFactory.retrieve();
        console.log(`Updated Favorite Number: ${updatedNum.toString()}`);
    } catch (error) {
        console.error("Error updating the favorite number:", error);
    }
}

// Execute the main function
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error during deployment:", error);
        process.exit(1);
    });



//0x086FA4f0D7Ff549574e2d27AE21fc4ceEF2D87B0