

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tender from './contractJson/Tender.json'; // Replace with your ABI JSON file
const TenderABI = Tender.abi; // Access the ABI property

function App() {
    const [account, setAccount] = useState(null);
    const [isOfficial, setIsOfficial] = useState(false);
    const [contract, setContract] = useState(null);
    const [tenders, setTenders] = useState([]);
    const [selectedTenderId, setSelectedTenderId] = useState(null);
    const [bids, setBids] = useState([]);
    const [sortedBids, setSortedBids] = useState([]);
    const [winners, setWinners] = useState({});
    const [bidAmount, setBidAmount] = useState(0);
    const [newTenderDesc, setNewTenderDesc] = useState('');
    const [selectedWinner, setSelectedWinner] = useState(null);
    const [minBidAmount, setMinBidAmount] = useState(0);
    // const contractAddress = '0xBeB7D590cEe06A941db8302434D023b52283D30B'; // Replace with your deployed contract address
    const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
    const officialAddress = '0x7CbF50988586a13463E1f93B5d5F8bc523F49d10'; // Replace with the government's wallet address

    useEffect(() => {
        const connectWallet = async () => {
            if (window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);
                const signer = await provider.getSigner();
                const tenderContract = new ethers.Contract(contractAddress, TenderABI, signer);
                setContract(tenderContract);

                const accounts = await provider.send("eth_requestAccounts", []);
                setAccount(accounts[0]);

                // Check if the connected wallet is the government official
                setIsOfficial(accounts[0].toLowerCase() === officialAddress.toLowerCase());

                // Load tenders after setting up the contract
                await loadTenders(tenderContract);
            } else {
                alert('MetaMask not detected!');
            }
        };

        connectWallet();
        // loadTenders();


        // Add event listener for account change
        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            setIsOfficial(accounts[0].toLowerCase() === officialAddress.toLowerCase());
            loadTenders();  // Reload tenders to reflect the new account context
        });

        return () => {
            // Clean up the event listener when the component unmounts
            window.ethereum.removeListener('accountsChanged', connectWallet);
        };
    }, []);
    // useEffect(() => {
    //     const connectWallet = async () => {
    //         if (window.ethereum) {
    //             const provider = new ethers.BrowserProvider(window.ethereum);
    //             const signer = await provider.getSigner();
    
    //             try {
    //                 // Listen for network changes
    //                 window.ethereum.on('chainChanged', (chainId) => {
    //                     console.log(`Network changed to ${parseInt(chainId, 16)}`);
    //                     window.location.reload(); // Reload the page on network change
    //                 });
    
    //                 const network = await provider.getNetwork();
    //                 if (network.chainId !== 31337) { // Replace 1337 with your expected chain ID (e.g., 31337 for Ganache)
    //                     alert('Please switch to the appropriate network');
    //                 }
    
    //                 const tenderContract = new ethers.Contract(contractAddress, TenderABI, signer);
    //                 setContract(tenderContract);
    //                 const accounts = await provider.send("eth_requestAccounts", []);
    //                 setAccount(accounts[0]);
    //                 setIsOfficial(accounts[0].toLowerCase() === officialAddress.toLowerCase());
    
    //                 await loadTenders(tenderContract);
    //             } catch (error) {
    //                 console.error("Error connecting wallet:", error);
    //             }
    //         } else {
    //             alert('MetaMask not detected!');
    //         }
    //     };
    
    //     connectWallet();
    
    //     return () => {
    //         window.ethereum.removeListener('chainChanged', () => window.location.reload());
    //     };
    // }, []);
    

    const loadTenders = async (tenderContract = contract) => {
        if (tenderContract) {
            let tempTenders = [];
            const totalTenders = await tenderContract.tenderCounter();
            console.log("TotalTenders:", totalTenders);
            for (let i = 1; i <= totalTenders; i++) {
                const tender = await tenderContract.getTenderDetails(i);
                tempTenders.push({ id: i, ...tender });
            }
            setTenders(tempTenders);
            console.log("tempTenders:\n", tempTenders);

        }
    };

    const createTender = async () => {
        if (contract) {

            const tx = await contract.createTender(newTenderDesc, ethers.parseUnits(minBidAmount.toString(), 'wei'));
            await tx.wait();
            alert('Tender created successfully!');
            loadTenders();
        }
    };

    const submitBid = async (tenderId) => {
        if (contract && bidAmount > 0) {
            const tx = await contract.submitBid(tenderId, ethers.parseUnits(bidAmount.toString(), 'wei'));
            await tx.wait();
            alert('Bid submitted successfully!');
            loadTenders();
        }
    };

    const viewBids = async (tenderId) => {
        console.log("Tender Id: ",tenderId);
        if (contract) {
            // const bidsList = await contract.getBids(tenderId);
            // setBids(bidsList);
            // console.log("Bids length: ",bids.length);
            // console.log("Bids: ",bids);
            // setSelectedTenderId(tenderId);



            const rawBidsList = await contract.getBids(tenderId);
        
            // Attempt to resolve Proxy by manually iterating or using mapping utilities
            const bidsList = rawBidsList.map((bid) => ({
                bidder: bid.bidder || 'N/A',
                amount: bid.bidAmount ? ethers.formatUnits(bid.bidAmount, 'wei') : null,
            }));

            const sorted = [...bidsList].sort((a, b) => a.bidAmount - b.bidAmount);

            // console.log("Bids after mapping:", bidsList);

            setBids(bidsList);
            setSelectedTenderId(tenderId);
            setSortedBids(sorted);
        }
    };



    const selectWinner = async (tenderId, winnerAddress) => {

        
        if (contract && isOfficial) {
            try {

                // console.log("Inside selectWinner");
                const tx = await contract.chooseWinner(tenderId, winnerAddress);
                await tx.wait();
                alert(`Winner selected successfully for tender ID ${tenderId}`);


                // Update the tenders list to show the winner
                // setSelectedWinner(winnerAddress);

                // let tempList = [];
                // tempList.push({tenderId: tenderId, winner: selectWinner}, ...winners);
                // setWinners(tempList);

                // Update the winners state with the selected winner for the tender
                // setWinners((prevWinners) => ({
                //     ...prevWinners,
                //     [tenderId]: winnerAddress, // Set winner for this tender ID
                // }));


                await loadTenders();

            } catch (error) {
                console.error('Error choosing winner:', error);
                alert('Failed to select winner');
            }
        }
    };

    return (
        <div className="App">
            <h1>Tender Management System</h1>
            <p>Connected account: {account}</p>

            {isOfficial ? (
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
                                    setMinBidAmount(''); // Reset if input is invalid
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
                                {/* <p>Minimum Bid: {ethers.formatUnits(tender.minBidAmount, 'wei')} wei</p> */}
                                <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
                                <p>Winner: {tender[4] !== ethers.AddressZero ? tender[4] : 'No winner yet'}</p>
                                {/* <p>Winner: {winners[tender.id] ? winners[tender.id] : 'No winner yet'}</p> */}
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
                                        <button onClick={() => selectWinner(selectedTenderId, bid.bidder)}>
                                            Select as Winner
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
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
                                {tender[3] && (
                                    <div>
                                        <input
                                            
                                            type="text"
                                            placeholder="Your Bid Amount (wei)"
                                            
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value);
                                                if (!isNaN(parsedValue)) {
                                                    setBidAmount(parsedValue);
                                                } else {
                                                    setBidAmount(''); // Reset if input is invalid
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
        </div>
    );
}

export default App;