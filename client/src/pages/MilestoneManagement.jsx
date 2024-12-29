// // import React, { useState, useEffect } from 'react';
// // import { ethers } from 'ethers';
// // import TenderContract from '../contractJson/Tender_Milestone.json';

// // const MilestoneManagement = () => {
// //     const [milestones, setMilestones] = useState([]);
// //     const [description, setDescription] = useState('');
// //     const [amount, setAmount] = useState('');
// //     const contractAddress = '0x71106C97353b423c9f8263652Ac963779fb8dfC5';

// //     useEffect(() => {
// //         const fetchMilestones = async () => {
// //             const provider = new ethers.providers.Web3Provider(window.ethereum);
// //             const contract = new ethers.Contract(contractAddress, TenderContract.abi, provider);
// //             const data = await contract.getMilestones(1); // Assuming tenderId = 1
// //             setMilestones(data);
// //         };

// //         fetchMilestones();
// //     }, []);

// //     const createMilestone = async () => {
// //         const provider = new ethers.providers.Web3Provider(window.ethereum);
// //         const signer = provider.getSigner();
// //         const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);
// //         await contract.createMilestone(1, description, ethers.utils.parseEther(amount));
// //     };

// //     return (
// //         <div>
// //             <h1>Milestone Management</h1>
// //             <form onSubmit={createMilestone}>
// //                 <input
// //                     type="text"
// //                     placeholder="Description"
// //                     value={description}
// //                     onChange={(e) => setDescription(e.target.value)}
// //                 />
// //                 <input
// //                     type="number"
// //                     placeholder="Amount"
// //                     value={amount}
// //                     onChange={(e) => setAmount(e.target.value)}
// //                 />
// //                 <button type="submit">Create Milestone</button>
// //             </form>
// //             <h2>Milestones</h2>
// //             <ul>
// //                 {milestones.map((ms, index) => (
// //                     <li key={index}>{ms.description} - {ethers.utils.formatEther(ms.amount)} ETH</li>
// //                 ))}
// //             </ul>
// //         </div>
// //     );
// // };

// // export default MilestoneManagement;


import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import Tender from '../contractJson/Tender_Milestone.json'; // Replace with your ABI JSON file
const TenderABI = Tender.abi;

function MilestoneManagement() {
    const [account, setAccount] = useState(null);
    const [userType, setUserType] = useState(''); // 'official', 'bidder', 'public', 'tenderer'
    const [contract, setContract] = useState(null);
    const [milestones, setMilestones] = useState([]);
    const [selectedTenderId, setSelectedTenderId] = useState(null);
    const [milestoneDesc, setMilestoneDesc] = useState('');
    const [milestoneAmount, setMilestoneAmount] = useState(0);
    const [totalFundAllocated, setTotalFundAllocated] = useState(0);
    const [remainingFund, setRemainingFund] = useState(0);

    // const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
    const contractAddress = '0x8062885aC55e56BF6f5a660f0B1eC9ADc59814E4'; // Replace with your deployed contract address
    const governmentOfficial = "0x7CbF50988586a13463E1f93B5d5F8bc523F49d10";
    const tenderer1 = "0xb7d489b00a12dd2e4dd210dd77c7419c78215443"; // Replace with your tenderer's address

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
                } else if (accounts[0].toLowerCase() === tenderer1.toLowerCase()) {
                    setUserType('tenderer');
                } else {
                    setUserType('public');
                }

                await loadTenderDetails(tenderContract);
            } else {
                alert('MetaMask not detected!');
            }
        };

        connectWallet();

        window.ethereum.on('accountsChanged', (accounts) => {
            setAccount(accounts[0]);
            if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
                setUserType('official');
            } else if (accounts[0].toLowerCase() === tenderer1.toLowerCase()) {
                setUserType('tenderer');
            } else {
                setUserType('public');
            }
            loadTenderDetails();
        });

        return () => {
            window.ethereum.removeListener('accountsChanged', connectWallet);
        };
    }, []);

    const loadTenderDetails = async (tenderContract = contract) => {
        if (tenderContract) {
            // Load tender details like total fund allocated
            const tenderDetails = await tenderContract.getTenderDetails(selectedTenderId);
            setTotalFundAllocated(ethers.formatUnits(tenderDetails[2], 'wei')); // Assuming total fund is at index 2
            setRemainingFund(totalFundAllocated); // Set initial remaining fund
            const milestoneCount = await tenderContract.getMilestoneCount(selectedTenderId);
            let milestonesArray = [];
            for (let i = 1; i <= milestoneCount; i++) {
                const milestone = await tenderContract.getMilestoneDetails(selectedTenderId, i);
                milestonesArray.push({ id: i, ...milestone });
            }
            setMilestones(milestonesArray);
        }
    };

    const createMilestone = async () => {
        if (contract && milestoneAmount > 0 && milestoneDesc) {
            if (remainingFund < milestoneAmount) {
                alert('Insufficient funds remaining to create this milestone.');
                return;
            }

            const tx = await contract.createMilestone(selectedTenderId, milestoneDesc, ethers.parseUnits(milestoneAmount.toString(), 'wei'));
            await tx.wait();

            alert('Milestone created successfully!');
            setMilestoneDesc('');
            setMilestoneAmount(0);
            loadTenderDetails();
        }
    };

    const sendFundsToTenderer = async (milestoneId) => {
        if (contract && userType === 'official') {
            const milestone = milestones.find(m => m.id === milestoneId);
            if (milestone && milestone.amount <= remainingFund) {
                const tx = await contract.sendFundsToTenderer(selectedTenderId, milestoneId);
                await tx.wait();

                setRemainingFund(remainingFund - milestone.amount);
                alert(`Funds sent successfully to tenderer for milestone ID ${milestoneId}`);
            } else {
                alert('Insufficient funds or milestone not found');
            }
        }
    };

    return (
        <div className="App">
            <h1>Milestone Management</h1>
            <p>Connected account: {account}</p>

            {userType === 'tenderer' && (
                <div>
                    <h2>Tenderer Panel</h2>
                    <h3>Create Milestone</h3>
                    <input
                        type="text"
                        placeholder="Milestone Description"
                        value={milestoneDesc}
                        onChange={(e) => setMilestoneDesc(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Milestone Amount (wei)"
                        value={milestoneAmount}
                        onChange={(e) => setMilestoneAmount(Number(e.target.value))}
                    />
                    <button onClick={createMilestone}>Create Milestone</button>
                </div>
            )}

            {userType === 'official' && (
                <div>
                    <h2>Government Official Panel</h2>
                    <h3>Milestones for Tender ID: {selectedTenderId}</h3>
                    <ul>
                        {milestones.map((milestone, index) => (
                            <li key={index}>
                                <p>Milestone ID: {milestone.id}</p>
                                <p>Description: {milestone.description}</p>
                                <p>Amount: {ethers.formatUnits(milestone.amount, 'wei')} wei</p>
                                <button onClick={() => sendFundsToTenderer(milestone.id)}>
                                    Send Funds to Tenderer
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}

export default MilestoneManagement;


// import React, { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';

// function MilestoneManagement() {

//     const [searchParams] = useSearchParams();
//     const role = searchParams.get('role'); // Get role from query params

//     const [milestones, setMilestones] = useState([]);
//     const [numMilestones, setNumMilestones] = useState(0);
//     const [currentMilestoneIndex, setCurrentMilestoneIndex] = useState(0);
//     const [milestoneName, setMilestoneName] = useState('');
//     const [requestedAmount, setRequestedAmount] = useState('');
//     const [fundsDisbursed, setFundsDisbursed] = useState([]);

//     const handleNumMilestonesSubmit = () => {
//         setMilestones(Array(numMilestones).fill({ name: '', amount: '' }));
//         setCurrentMilestoneIndex(0);
//     };

//     const handleMilestoneSubmit = () => {
//         const updatedMilestones = [...milestones];
//         updatedMilestones[currentMilestoneIndex] = {
//             name: milestoneName,
//             amount: requestedAmount,
//         };
//         setMilestones(updatedMilestones);
//         setCurrentMilestoneIndex(currentMilestoneIndex + 1);
//         setMilestoneName('');
//         setRequestedAmount('');
//     };

//     const handleDisburseFund = (index) => {
//         setFundsDisbursed([...fundsDisbursed, index]);
//     };

//     return (
//         <div>
//             <h1>Milestone Management</h1>
//             {role === 'bidder' && (
//                 <>
//                     {milestones.length === 0 ? (
//                         <div>
//                             <label>
//                                 Number of Milestones:
//                                 <input
//                                     type="number"
//                                     value={numMilestones}
//                                     onChange={(e) => setNumMilestones(parseInt(e.target.value, 10))}
//                                 />
//                             </label>
//                             <button onClick={handleNumMilestonesSubmit}>Submit</button>
//                         </div>
//                     ) : currentMilestoneIndex < numMilestones ? (
//                         <div>
//                             <h3>Create Milestone {currentMilestoneIndex + 1}</h3>
//                             <label>
//                                 Milestone Name:
//                                 <input
//                                     type="text"
//                                     value={milestoneName}
//                                     onChange={(e) => setMilestoneName(e.target.value)}
//                                 />
//                             </label>
//                             <label>
//                                 Requested Amount:
//                                 <input
//                                     type="number"
//                                     value={requestedAmount}
//                                     onChange={(e) => setRequestedAmount(e.target.value)}
//                                 />
//                             </label>
//                             <button onClick={handleMilestoneSubmit}>Add Milestone</button>
//                         </div>
//                     ) : (
//                         <div>
//                             <h3>Milestones Created:</h3>
//                             <ul>
//                                 {milestones.map((milestone, index) => (
//                                     <li key={index}>
//                                         <strong>{milestone.name}</strong>: ${milestone.amount}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </>
//             )}

//             {role === 'official' && (
//                 <div>
//                     <h3>Milestones:</h3>
//                     <ul>
//                         {milestones.map((milestone, index) => (
//                             <li key={index}>
//                                 <strong>{milestone.name}</strong>: ${milestone.amount}
//                                 <button
//                                     onClick={() => handleDisburseFund(index)}
//                                     disabled={fundsDisbursed.includes(index)}
//                                 >
//                                     {fundsDisbursed.includes(index) ? 'Fund Disbursed' : 'Disburse Fund'}
//                                 </button>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default MilestoneManagement;
