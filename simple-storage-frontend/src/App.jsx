import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import SimpleStorage from './contractJson/SimpleStorage.json'; // Replace with your ABI JSON file
const SimpleStorageABI = SimpleStorage.abi; // Access the ABI property


function App() {
    const [favoriteNumber, setFavoriteNumber] = useState(0);
    const [contract, setContract] = useState(null);
    const [account, setAccount] = useState(null);
    const contractAddress = '0x086FA4f0D7Ff549574e2d27AE21fc4ceEF2D87B0'; // Replace with your deployed contract address

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum); // Updated way to initialize the provider
                const signer = await provider.getSigner();
                const simpleStorageContract = new ethers.Contract(contractAddress, SimpleStorageABI, signer);
                setContract(simpleStorageContract);

                const accounts = await provider.send("eth_requestAccounts", []);
                console.log(accounts);
                setAccount(accounts[0]);
            } else {
                alert('MetaMask not detected!');
            }
        };

        connectWallet();
    }, []);

    const storeFavoriteNumber = async () => {
        if (contract) {
            const tx = await contract.store(favoriteNumber);
            await tx.wait();
            alert('Favorite number stored!');
        }
    };

    const retrieveFavoriteNumber = async () => {
        if (contract) {
            const number = await contract.retrieve();
            alert(`Favorite number is: ${number}`);
        }
    };

    return (
        <div className="App">
            <h1>Simple Storage</h1>
            <p>Connected account: {account}</p>
            <input
                type="number"
                value={favoriteNumber}
                onChange={(e) => setFavoriteNumber(e.target.value)}
            />
            <button onClick={storeFavoriteNumber}>Store Number</button>
            <button onClick={retrieveFavoriteNumber}>Retrieve Number</button>
        </div>
    );
}

export default App;
