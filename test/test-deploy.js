const {ethers} = require("hardhat");
const {expert,assert} = require("chai");


describe("SimpleStorage", () => {

    let SimpleStorageFactory, simpleStorage;

    beforeEach( async function () {
        SimpleStorageFactory = await ethers.deployContract("SimpleStorage");
        // console.log("Deploying, please wait...");

        simpleStorage = await SimpleStorageFactory.waitForDeployment();
        // console.log("Contract deployed at address:", simpleStorage.target);
    })

    it ("Should start with a fav number of 0", async function ()  {
        const currVal = await simpleStorage.retrieve();
        const expectedVal = '0';

        assert.equal(currVal.toString(),expectedVal);

    })



})