import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TenderContract from '../contractJson/Tender_Milestone.json';

const TenderManagement = () => {
    const [tenders, setTenders] = useState([]);
    const [description, setDescription] = useState('');
    const [minBidAmount, setMinBidAmount] = useState('');
    const [totalFunds, setTotalFunds] = useState('');
    const [tenderId, setTenderId] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const [winnerAddress, setWinnerAddress] = useState('');
    const contractAddress = '0x71106C97353b423c9f8263652Ac963779fb8dfC5'; // Replace with your contract address

    useEffect(() => {
        fetchTenders();
    }, []);

    const fetchTenders = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, TenderContract.abi, provider);

        const tendersList = [];
        for (let i = 1; ; i++) {
            try {
                const tender = await contract.getTenderDetails(i);
                tendersList.push(tender);
            } catch (error) {
                break; // Exit loop when no more tenders exist
            }
        }
        setTenders(tendersList);
    };

    const createTender = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);

        try {
            await contract.createTender(description, ethers.utils.parseEther(minBidAmount), ethers.utils.parseEther(totalFunds));
            alert('Tender created successfully!');
            fetchTenders();
        } catch (error) {
            console.error('Error creating tender:', error);
        }
    };

    const submitBid = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);

        try {
            await contract.submitBid(tenderId, ethers.utils.parseEther(bidAmount));
            alert('Bid submitted successfully!');
        } catch (error) {
            console.error('Error submitting bid:', error);
        }
    };

    const chooseWinner = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);

        try {
            await contract.chooseWinner(tenderId, winnerAddress);
            alert('Winner selected successfully!');
            fetchTenders();
        } catch (error) {
            console.error('Error selecting winner:', error);
        }
    };

    return (
        <div>
            <h1>Tender Management</h1>

            {/* Create Tender Form */}
            <section>
                <h2>Create Tender</h2>
                <form onSubmit={(e) => { e.preventDefault(); createTender(); }}>
                    <input
                        type="text"
                        placeholder="Tender Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Minimum Bid Amount (ETH)"
                        value={minBidAmount}
                        onChange={(e) => setMinBidAmount(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Total Funds (ETH)"
                        value={totalFunds}
                        onChange={(e) => setTotalFunds(e.target.value)}
                    />
                    <button type="submit">Create Tender</button>
                </form>
            </section>

            {/* List of Tenders */}
            <section>
                <h2>Available Tenders</h2>
                <ul>
                    {tenders.map((tender, index) => (
                        <li key={index}>
                            <p><strong>ID:</strong> {tender.id.toString()}</p>
                            <p><strong>Description:</strong> {tender.description}</p>
                            <p><strong>Min Bid Amount:</strong> {ethers.utils.formatEther(tender.minBidAmount)} ETH</p>
                            <p><strong>Total Funds:</strong> {ethers.utils.formatEther(tender.totalFunds)} ETH</p>
                            <p><strong>Winner:</strong> {tender.winner === ethers.constants.AddressZero ? 'None' : tender.winner}</p>
                        </li>
                    ))}
                </ul>
            </section>

            {/* Submit Bid Form */}
            <section>
                <h2>Submit a Bid</h2>
                <form onSubmit={(e) => { e.preventDefault(); submitBid(); }}>
                    <input
                        type="number"
                        placeholder="Tender ID"
                        value={tenderId}
                        onChange={(e) => setTenderId(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Bid Amount (ETH)"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button type="submit">Submit Bid</button>
                </form>
            </section>

            {/* Choose Winner Form */}
            <section>
                <h2>Choose Winner</h2>
                <form onSubmit={(e) => { e.preventDefault(); chooseWinner(); }}>
                    <input
                        type="number"
                        placeholder="Tender ID"
                        value={tenderId}
                        onChange={(e) => setTenderId(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Winner Address"
                        value={winnerAddress}
                        onChange={(e) => setWinnerAddress(e.target.value)}
                    />
                    <button type="submit">Choose Winner</button>
                </form>
            </section>
        </div>
    );
};

export default TenderManagement;
