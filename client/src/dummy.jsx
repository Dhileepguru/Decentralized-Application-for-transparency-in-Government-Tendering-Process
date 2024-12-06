

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tender from './contractJson/Tender.json'; // Replace with your ABI JSON file
const TenderABI = Tender.abi; // Access the ABI property

function App() {
    

    const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
    const [account, setAccount] = useState(null);
    const [userType, setUserType] = useState(''); // 'official', 'bidder', 'public'
    const [contract, setContract] = useState(null);
    const [tenders, setTenders] = useState([]);
    const [selectedTenderId, setSelectedTenderId] = useState(null);
    const [bids, setBids] = useState([]);
    const [sortedBids, setSortedBids] = useState([]);
    const [bidAmount, setBidAmount] = useState(0);
    const [newTenderDesc, setNewTenderDesc] = useState('');
    const [minBidAmount, setMinBidAmount] = useState(0);
    const [bidHistory, setBidHistory] = useState({});
    
    const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
    const governmentOfficial = "0x7CbF50988586a13463E1f93B5d5F8bc523F49d10";
    const bidder1 = "0xb7d489b00a12dd2e4dd210dd77c7419c78215443";
    const public1 = "0x14758BD24d28D608E72038Ec49D24441dDeF418F";

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const tenderContract = new ethers.Contract(contractAddress, TenderABI, signer);
                setContract(tenderContract);

                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);

                if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
                    setUserType('official');
                } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
                    setUserType('bidder');
                } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
                    setUserType('public');
                } else {
                    setUserType('unknown');
                }

                await loadTenders(tenderContract);
            } else {
                alert('MetaMask not detected!');
            }
        };

        connectWallet();

        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
                setUserType('official');
            } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
                setUserType('bidder');
            } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
                setUserType('public');
            } else {
                setUserType('unknown');
            }
            loadTenders();
        });

        return () => {
            window.ethereum.removeListener('accountsChanged', connectWallet);
        };
    }, []);




    const loadTenders = async (tenderContract = contract) => {
        if (tenderContract) {
            let tempTenders = [];
            const totalTenders = await tenderContract.tenderCounter();
            for (let i = 1; i <= totalTenders; i++) {
                const tender = await tenderContract.getTenderDetails(i);
                tempTenders.push({ id: i, ...tender });
            }
            setTenders(tempTenders);
        }
    };

    const createTender = async () => {
        if (contract) {
            if (window.confirm("Are you sure you want to create this tender?")) {
                const tx = await contract.createTender(newTenderDesc, ethers.parseUnits(minBidAmount.toString(), 'wei'));
                await tx.wait();
                alert('Tender created successfully!');
                setNewTenderDesc('');
                setMinBidAmount('');
                loadTenders();
            }
        }
    };

    const submitBid = async (tenderId) => {
        if (contract && bidAmount > 0) {
            if (window.confirm("Are you sure you want to submit your bid?")) {
                if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
                    alert('You can only bid once on a particular tender.');
                    return;
                }

                const tx = await contract.submitBid(tenderId, ethers.parseUnits(bidAmount.toString(), 'wei'));
                await tx.wait();
                alert('Bid submitted successfully!');
                setBidHistory((prev) => ({
                    ...prev,
                    [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
                }));
                setBidAmount('');
                loadTenders();
            }
        }
    };

    const viewBids = async (tenderId) => {
        if (contract) {
            const rawBidsList = await contract.getBids(tenderId);
            const bidsList = rawBidsList.map((bid) => ({
                bidder: bid.bidder || 'N/A',
                amount: bid.bidAmount ? ethers.formatUnits(bid.bidAmount, 'wei') : null,
            }));
            const sorted = [...bidsList].sort((a, b) => a.amount - b.amount);
            setBids(bidsList);
            setSelectedTenderId(tenderId);
            setSortedBids(sorted);
        }
    };

    const selectWinner = async (tenderId, winnerAddress) => {
        if (contract && userType==="official") {
            if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId}?`)) {
                try {
                    const tx = await contract.chooseWinner(tenderId, winnerAddress);
                    await tx.wait();
                    alert(`Winner selected successfully for tender ID ${tenderId}`);
                    setBids([]);
                    await loadTenders();
                } catch (error) {
                    console.error('Error choosing winner:', error);
                    alert('Failed to select winner');
                }
            }
        }
    };

    return (
        <div className="App">
            <h1>Tender Management System</h1>
            <p>Connected account: {account}</p>


            {userType === 'public' && (
                <div>
                    <h2>Public Panel</h2>
                    <h3>All Tenders</h3>
                    <ul>
                        {tenders.map((tender, index) => (
                            <li key={index}>
                                <p>Tender ID: {tender.id}</p>
                                <p>Description: {tender[1]}</p>
                                <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
                                <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
                                <p>Winner: {tender[4] !== ZERO_ADDRESS ? tender[4] : 'No winner yet'}</p>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {userType === 'bidder' && (
                <div>
                    <h2>Bidder Panel</h2>
                    <h3>Available Tenders</h3>
                    <ul>
                        {tenders.map((tender, index) => (
                            <li key={index}>
                                <p>Tender ID: {tender.id}</p>
                                <p>Description: {tender[1]}</p>
                                <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
                                <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
                                {tender[3] && !(bidHistory[tender.id] && bidHistory[tender.id].includes(account)) && (
                                    <div>
                                        <input
                                            type="text"
                                            placeholder="Your Bid Amount (wei)"
                                            value={bidAmount}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value);
                                                if (!isNaN(parsedValue)) {
                                                    setBidAmount(parsedValue);
                                                } else {
                                                    setBidAmount('');
                                                }
                                            }}
                                        />
                                        <button onClick={() => submitBid(tender.id)}>Submit Bid</button>
                                    </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {userType === 'official' && (
                <div>
                    <h2>Government Official Panel</h2>
                    <div>
                        <h3>Create New Tender</h3>
                        <input
                            type="text"
                            placeholder="Tender Description"
                            value={newTenderDesc}
                            onChange={(e) => setNewTenderDesc(e.target.value)}
                        />
                        <input
                            type="text"
                            placeholder="Minimum Bid Amount (wei)"
                            value={minBidAmount}
                            onChange={(e) => {
                                const parsedValue = parseInt(e.target.value);
                                if (!isNaN(parsedValue)) {
                                    setMinBidAmount(parsedValue);
                                } else {
                                    setMinBidAmount('');
                                }
                            }}
                        />
                        <button onClick={createTender}>Create Tender</button>
                    </div>
                    <h3>All Tenders</h3>
                    <ul>
                        {tenders.map((tender, index) => (
                            <li key={index}>
                                <p>Tender ID: {tender.id}</p>
                                <p>Description: {tender[1]}</p>
                                <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
                                <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
                                <p>Winner: {tender[4] !== ZERO_ADDRESS ? tender[4] : 'No winner yet'}</p>
                                {/* {tender[3] && <button onClick={() => viewBids(tender.id)}>View Bids</button>} */}
                                <button onClick={() => viewBids(tender.id)}>View Bids</button>

                            </li>
                        ))}
                    </ul>

                    {selectedTenderId && sortedBids.length > 0 && (
                        <div>
                            <h3>Bids for Tender ID: {selectedTenderId}</h3>
                            <ul>
                                {sortedBids.map((bid, index) => (
                                    <li key={index}>
                                        <p>Bidder: {bid.bidder}</p>
                                        <p>Bid Amount: {ethers.formatUnits(bid.amount, 'wei')} wei</p>
                                        {tenders.find(tender => tender.id === selectedTenderId)?.[4] === ZERO_ADDRESS && (
                                            <button onClick={() => selectWinner(selectedTenderId, bid.bidder)}>Select as Winner</button>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default App;
