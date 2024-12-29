// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import TenderContract from '../contractJson/Tender_Milestone.json';

// const TenderManagement = () => {
//     const [tenders, setTenders] = useState([]);
//     const [description, setDescription] = useState('');
//     const [minBidAmount, setMinBidAmount] = useState('');
//     const [totalFunds, setTotalFunds] = useState('');
//     const [tenderId, setTenderId] = useState('');
//     const [bidAmount, setBidAmount] = useState('');
//     const [winnerAddress, setWinnerAddress] = useState('');

//     // Role Addresses
//     const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4';
//     const governmentOfficial = '0x7CbF50988586a13463E1f93B5d5F8bc523F49d10';
//     const bidder1 = '0xb7d489b00a12dd2e4dd210dd77c7419c78215443';
//     const public1 = '0x14758BD24d28D608E72038Ec49D24441dDeF418F';

//     useEffect(() => {
//         fetchTenders();
//     }, []);

//     const fetchTenders = async () => {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const contract = new ethers.Contract(contractAddress, TenderContract.abi, provider);

//         const tendersList = [];
//         for (let i = 1; ; i++) {
//             try {
//                 const tender = await contract.getTenderDetails(i);
//                 tendersList.push(tender);
//             } catch (error) {
//                 break; // Exit loop when no more tenders exist
//             }
//         }
//         setTenders(tendersList);
//     };

//     const createTender = async () => {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();

//         if (address !== governmentOfficial) {
//             alert("Only the government official can create tenders.");
//             return;
//         }

//         const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);
//         try {
//             await contract.createTender(description, ethers.utils.parseEther(minBidAmount), ethers.utils.parseEther(totalFunds));
//             alert('Tender created successfully!');
//             fetchTenders();
//         } catch (error) {
//             console.error('Error creating tender:', error);
//         }
//     };

//     const submitBid = async () => {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();

//         if (address !== bidder1) {
//             alert("Only bidders can submit bids.");
//             return;
//         }

//         const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);
//         try {
//             await contract.submitBid(tenderId, ethers.utils.parseEther(bidAmount));
//             alert('Bid submitted successfully!');
//         } catch (error) {
//             console.error('Error submitting bid:', error);
//         }
//     };

//     const chooseWinner = async () => {
//         const provider = new ethers.providers.Web3Provider(window.ethereum);
//         const signer = provider.getSigner();
//         const address = await signer.getAddress();

//         if (address !== governmentOfficial) {
//             alert("Only the government official can choose a winner.");
//             return;
//         }

//         const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);
//         try {
//             await contract.chooseWinner(tenderId, winnerAddress);
//             alert('Winner selected successfully!');
//             fetchTenders();
//         } catch (error) {
//             console.error('Error selecting winner:', error);
//         }
//     };

//     return (
//         <div>
//             <h1>Tender Management</h1>
//             <section>
//                 <h2>Create Tender</h2>
//                 <form onSubmit={(e) => { e.preventDefault(); createTender(); }}>
//                     <input
//                         type="text"
//                         placeholder="Tender Description"
//                         value={description}
//                         onChange={(e) => setDescription(e.target.value)}
//                     />
//                     <input
//                         type="number"
//                         placeholder="Minimum Bid Amount (ETH)"
//                         value={minBidAmount}
//                         onChange={(e) => setMinBidAmount(e.target.value)}
//                     />
//                     <input
//                         type="number"
//                         placeholder="Total Funds (ETH)"
//                         value={totalFunds}
//                         onChange={(e) => setTotalFunds(e.target.value)}
//                     />
//                     <button type="submit">Create Tender</button>
//                 </form>
//             </section>

//             <section>
//                 <h2>Available Tenders</h2>
//                 <ul>
//                     {tenders.map((tender, index) => (
//                         <li key={index}>
//                             <p><strong>ID:</strong> {tender.id.toString()}</p>
//                             <p><strong>Description:</strong> {tender.description}</p>
//                             <p><strong>Min Bid Amount:</strong> {ethers.utils.formatEther(tender.minBidAmount)} ETH</p>
//                             <p><strong>Total Funds:</strong> {ethers.utils.formatEther(tender.totalFunds)} ETH</p>
//                             <p><strong>Winner:</strong> {tender.winner === ethers.constants.AddressZero ? 'None' : tender.winner}</p>
//                         </li>
//                     ))}
//                 </ul>
//             </section>

//             <section>
//                 <h2>Submit a Bid</h2>
//                 <form onSubmit={(e) => { e.preventDefault(); submitBid(); }}>
//                     <input
//                         type="number"
//                         placeholder="Tender ID"
//                         value={tenderId}
//                         onChange={(e) => setTenderId(e.target.value)}
//                     />
//                     <input
//                         type="number"
//                         placeholder="Bid Amount (ETH)"
//                         value={bidAmount}
//                         onChange={(e) => setBidAmount(e.target.value)}
//                     />
//                     <button type="submit">Submit Bid</button>
//                 </form>
//             </section>

//             <section>
//                 <h2>Choose Winner</h2>
//                 <form onSubmit={(e) => { e.preventDefault(); chooseWinner(); }}>
//                     <input
//                         type="number"
//                         placeholder="Tender ID"
//                         value={tenderId}
//                         onChange={(e) => setTenderId(e.target.value)}
//                     />
//                     <input
//                         type="text"
//                         placeholder="Winner Address"
//                         value={winnerAddress}
//                         onChange={(e) => setWinnerAddress(e.target.value)}
//                     />
//                     <button type="submit">Choose Winner</button>
//                 </form>
//             </section>
//         </div>
//     );
// };

// export default TenderManagement;


//---------------------------------------------


// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import Tender from '../contractJson/Tender_Milestone.json'; // Replace with your ABI JSON file

// const TenderManagement = () => {
//     const [account, setAccount] = useState(null);
//     const [userType, setUserType] = useState('');
//     const [contract, setContract] = useState(null);
//     const [tenders, setTenders] = useState([]);
//     const [selectedTenderId, setSelectedTenderId] = useState(null);
//     const [bidAmount, setBidAmount] = useState(0);
//     const [newTenderDesc, setNewTenderDesc] = useState('');
//     const [minBidAmount, setMinBidAmount] = useState(0);
//     const [bidHistory, setBidHistory] = useState({});

//     const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
//     const governmentOfficial = "0x7CbF50988586a13463E1f93B5d5F8bc523F49d10";
//     const bidder1 = "0xb7d489b00a12dd2e4dd210dd77c7419c78215443";
//     const public1 = "0x14758BD24d28D608E72038Ec49D24441dDeF418F";

//     useEffect(() => {
//         const connectWallet = async () => {
//             if (window.ethereum) {
//                 const provider = new ethers.BrowserProvider(window.ethereum);
//                 const signer = await provider.getSigner();
//                 const tenderContract = new ethers.Contract(contractAddress, Tender.abi, signer);
//                 setContract(tenderContract);

//                 const accounts = await provider.send("eth_requestAccounts", []);
//                 setAccount(accounts[0]);

//                 if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
//                     setUserType('official');
//                 } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
//                     setUserType('bidder');
//                 } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
//                     setUserType('public');
//                 } else {
//                     setUserType('unknown');
//                 }

//                 await loadTenders(tenderContract);
//             } else {
//                 alert('MetaMask not detected!');
//             }
//         };

//         connectWallet();

//         window.ethereum.on('accountsChanged', (accounts) => {
//             setAccount(accounts[0]);
//             if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
//                 setUserType('official');
//             } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
//                 setUserType('bidder');
//             } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
//                 setUserType('public');
//             } else {
//                 setUserType('unknown');
//             }
//             loadTenders();
//         });

//         return () => {
//             window.ethereum.removeListener('accountsChanged', connectWallet);
//         };
//     }, []);

//     const loadTenders = async (tenderContract = contract) => {
//         if (tenderContract) {
//             let tempTenders = [];
//             const totalTenders = await tenderContract.tenderCounter();
//             for (let i = 1; i <= totalTenders; i++) {
//                 const tender = await tenderContract.getTenderDetails(i);
//                 tempTenders.push({ id: i, ...tender });
//             }
//             setTenders(tempTenders);
//         }
//     };

//     const createTender = async () => {
//         if (contract) {
//             if (window.confirm("Are you sure you want to create this tender?")) {
//                 const tx = await contract.createTender(newTenderDesc, ethers.parseUnits(minBidAmount.toString(), 'wei'));
//                 await tx.wait();
//                 alert('Tender created successfully!');
//                 setNewTenderDesc('');
//                 setMinBidAmount('');
//                 loadTenders();
//             }
//         }
//     };

//     const submitBid = async (tenderId) => {
//         if (contract && bidAmount > 0) {
//             if (window.confirm("Are you sure you want to submit your bid?")) {
//                 if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
//                     alert('You can only bid once on a particular tender.');
//                     return;
//                 }

//                 const tx = await contract.submitBid(tenderId, ethers.parseUnits(bidAmount.toString(), 'wei'));
//                 await tx.wait();
//                 alert('Bid submitted successfully!');
//                 setBidHistory((prev) => ({
//                     ...prev,
//                     [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
//                 }));
//                 setBidAmount('');
//                 loadTenders();
//             }
//         }
//     };

//     const selectWinner = async (tenderId, winnerAddress) => {
//         if (contract && userType === "official") {
//             if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId}?`)) {
//                 try {
//                     const tx = await contract.chooseWinner(tenderId, winnerAddress);
//                     await tx.wait();
//                     alert(`Winner selected successfully for tender ID ${tenderId}`);
//                     await loadTenders();
//                 } catch (error) {
//                     console.error('Error choosing winner:', error);
//                     alert('Failed to select winner');
//                 }
//             }
//         }
//     };

//     return (
//         <div className="App">
//             <h1>Tender Management System</h1>
//             <p>Connected account: {account}</p>

//             {userType === 'public' && (
//                 <div>
//                     <h2>Public Panel</h2>
//                     <h3>All Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender.description}</p>
//                                 <p>Minimum Bid: {ethers.formatUnits(tender.minBidAmount, 'wei')} wei</p>
//                                 <p>Status: {tender.isOpen ? 'Open' : 'Closed'}</p>
//                                 <p>Winner: {tender.winner !== "0x0000000000000000000000000000000000000000" ? tender.winner : 'No winner yet'}</p>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {userType === 'bidder' && (
//                 <div>
//                     <h2>Bidder Panel</h2>
//                     <h3>Available Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender.description}</p>
//                                 <p>Minimum Bid: {ethers.formatUnits(tender.minBidAmount, 'wei')} wei</p>
//                                 <p>Status: {tender.isOpen ? 'Open' : 'Closed'}</p>
//                                 {tender.isOpen && !(bidHistory[tender.id] && bidHistory[tender.id].includes(account)) && (
//                                     <div>
//                                         <input
//                                             type="number"
//                                             placeholder="Your Bid Amount (wei)"
//                                             value={bidAmount}
//                                             onChange={(e) => setBidAmount(e.target.value)}
//                                         />
//                                         <button onClick={() => submitBid(tender.id)}>Submit Bid</button>
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {userType === 'official' && (
//                 <div>
//                     <h2>Government Official Panel</h2>
//                     <div>
//                         <h3>Create New Tender</h3>
//                         <input
//                             type="text"
//                             placeholder="Tender Description"
//                             value={newTenderDesc}
//                             onChange={(e) => setNewTenderDesc(e.target.value)}
//                         />
//                         <input
//                             type="number"
//                             placeholder="Minimum Bid Amount (wei)"
//                             value={minBidAmount}
//                             onChange={(e) => setMinBidAmount(e.target.value)}
//                         />
//                         <button onClick={createTender}>Create Tender</button>
//                     </div>
//                     <h3>All Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender.description}</p>
//                                 <p>Minimum Bid: {ethers.formatUnits(tender.minBidAmount, 'wei')} wei</p>
//                                 <p>Status: {tender.isOpen ? 'Open' : 'Closed'}</p>
//                                 <p>Winner: {tender.winner !== "0x0000000000000000000000000000000000000000" ? tender.winner : 'No winner yet'}</p>
//                                 {tender.isOpen && <button onClick={() => viewBids(tender.id)}>View Bids</button>}
//                             </li>
//                         ))}
//                     </ul>

//                     {selectedTenderId && (
//                         <div>
//                             <h3>Bids for Tender ID: {selectedTenderId}</h3>
//                             <ul>
//                                 {sortedBids.map((bid, index) => (
//                                     <li key={index}>
//                                         <p>Bidder: {bid.bidder}</p>
//                                         <p>Bid Amount: {ethers.formatUnits(bid.amount, 'wei')} wei</p>
//                                         {tenders.find(tender => tender.id === selectedTenderId)?.winner === "0x0000000000000000000000000000000000000000" && (
//                                             <button onClick={() => selectWinner(selectedTenderId, bid.bidder)}>Select as Winner</button>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };

// export default TenderManagement;


//----------------------------------------------



// import React, { useState, useEffect } from 'react';
// import { ethers } from 'ethers';
// import Tender from '../contractJson/Tender_Milestone.json'; // Replace with your ABI JSON file
// const TenderABI = Tender.abi; // Access the ABI property

// function App() {


//     const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
//     const [account, setAccount] = useState(null);
//     const [userType, setUserType] = useState(''); // 'official', 'bidder', 'public'
//     const [contract, setContract] = useState(null);
//     const [tenders, setTenders] = useState([]);
//     const [selectedTenderId, setSelectedTenderId] = useState(null);
//     const [bids, setBids] = useState([]);
//     const [sortedBids, setSortedBids] = useState([]);
//     const [bidAmount, setBidAmount] = useState(0);
//     const [newTenderDesc, setNewTenderDesc] = useState('');
//     const [minBidAmount, setMinBidAmount] = useState(0);
//     const [bidHistory, setBidHistory] = useState({});

//     const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
//     const governmentOfficial = "0x7CbF50988586a13463E1f93B5d5F8bc523F49d10";
//     const bidder1 = "0xb7d489b00a12dd2e4dd210dd77c7419c78215443";
//     const public1 = "0x14758BD24d28D608E72038Ec49D24441dDeF418F";

//     useEffect(() => {
//         const connectWallet = async () => {
//             if (window.ethereum) {
//                 const provider = new ethers.BrowserProvider(window.ethereum);
//                 const signer = await provider.getSigner();
//                 const tenderContract = new ethers.Contract(contractAddress, TenderABI, signer);
//                 setContract(tenderContract);

//                 const accounts = await provider.send("eth_requestAccounts", []);
//                 setAccount(accounts[0]);

//                 if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
//                     setUserType('official');
//                 } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
//                     setUserType('bidder');
//                 } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
//                     setUserType('public');
//                 } else {
//                     setUserType('unknown');
//                 }

//                 await loadTenders(tenderContract);
//             } else {
//                 alert('MetaMask not detected!');
//             }
//         };

//         connectWallet();

//         window.ethereum.on('accountsChanged', (accounts) => {
//             setAccount(accounts[0]);
//             if (accounts[0].toLowerCase() === governmentOfficial.toLowerCase()) {
//                 setUserType('official');
//             } else if (accounts[0].toLowerCase() === bidder1.toLowerCase()) {
//                 setUserType('bidder');
//             } else if (accounts[0].toLowerCase() === public1.toLowerCase()) {
//                 setUserType('public');
//             } else {
//                 setUserType('unknown');
//             }
//             loadTenders();
//         });

//         return () => {
//             window.ethereum.removeListener('accountsChanged', connectWallet);
//         };
//     }, []);




//     const loadTenders = async (tenderContract = contract) => {
//         if (tenderContract) {
//             let tempTenders = [];
//             const totalTenders = await tenderContract.tenderCounter();
//             for (let i = 1; i <= totalTenders; i++) {
//                 const tender = await tenderContract.getTenderDetails(i);
//                 tempTenders.push({ id: i, ...tender });
//             }
//             setTenders(tempTenders);
//         }
//     };

//     const createTender = async () => {
//         if (contract) {
//             if (window.confirm("Are you sure you want to create this tender?")) {
//                 const tx = await contract.createTender(newTenderDesc, ethers.parseUnits(minBidAmount.toString(), 'wei'));
//                 await tx.wait();
//                 alert('Tender created successfully!');
//                 setNewTenderDesc('');
//                 setMinBidAmount('');
//                 loadTenders();
//             }
//         }
//     };

//     const submitBid = async (tenderId) => {
//         if (contract && bidAmount > 0) {
//             if (window.confirm("Are you sure you want to submit your bid?")) {
//                 if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
//                     alert('You can only bid once on a particular tender.');
//                     return;
//                 }

//                 const tx = await contract.submitBid(tenderId, ethers.parseUnits(bidAmount.toString(), 'wei'));
//                 await tx.wait();
//                 alert('Bid submitted successfully!');
//                 setBidHistory((prev) => ({
//                     ...prev,
//                     [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
//                 }));
//                 setBidAmount('');
//                 loadTenders();
//             }
//         }
//     };

//     const viewBids = async (tenderId) => {
//         if (contract) {
//             const rawBidsList = await contract.getBids(tenderId);
//             const bidsList = rawBidsList.map((bid) => ({
//                 bidder: bid.bidder || 'N/A',
//                 amount: bid.bidAmount ? ethers.formatUnits(bid.bidAmount, 'wei') : null,
//             }));
//             const sorted = [...bidsList].sort((a, b) => a.amount - b.amount);
//             setBids(bidsList);
//             setSelectedTenderId(tenderId);
//             setSortedBids(sorted);
//         }
//     };

//     const selectWinner = async (tenderId, winnerAddress) => {
//         if (contract && userType==="official") {
//             if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId}?`)) {
//                 try {
//                     const tx = await contract.chooseWinner(tenderId, winnerAddress);
//                     await tx.wait();
//                     alert(`Winner selected successfully for tender ID ${tenderId}`);
//                     setBids([]);
//                     await loadTenders();
//                 } catch (error) {
//                     console.error('Error choosing winner:', error);
//                     alert('Failed to select winner');
//                 }
//             }
//         }
//     };

//     return (
//         <div className="App">
//             <h1>Tender Management System</h1>
//             <p>Connected account: {account}</p>


//             {userType === 'public' && (
//                 <div>
//                     <h2>Public Panel</h2>
//                     <h3>All Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender[1]}</p>
//                                 <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
//                                 <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
//                                 <p>Winner: {tender[4] !== ZERO_ADDRESS ? tender[4] : 'No winner yet'}</p>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {userType === 'bidder' && (
//                 <div>
//                     <h2>Bidder Panel</h2>
//                     <h3>Available Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender[1]}</p>
//                                 <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
//                                 <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
//                                 {tender[3] && !(bidHistory[tender.id] && bidHistory[tender.id].includes(account)) && (
//                                     <div>
//                                         <input
//                                             type="text"
//                                             placeholder="Your Bid Amount (wei)"
//                                             value={bidAmount}
//                                             onChange={(e) => {
//                                                 const parsedValue = parseInt(e.target.value);
//                                                 if (!isNaN(parsedValue)) {
//                                                     setBidAmount(parsedValue);
//                                                 } else {
//                                                     setBidAmount('');
//                                                 }
//                                             }}
//                                         />
//                                         <button onClick={() => submitBid(tender.id)}>Submit Bid</button>
//                                     </div>
//                                 )}
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             )}

//             {userType === 'official' && (
//                 <div>
//                     <h2>Government Official Panel</h2>
//                     <div>
//                         <h3>Create New Tender</h3>
//                         <input
//                             type="text"
//                             placeholder="Tender Description"
//                             value={newTenderDesc}
//                             onChange={(e) => setNewTenderDesc(e.target.value)}
//                         />
//                         <input
//                             type="text"
//                             placeholder="Minimum Bid Amount (wei)"
//                             value={minBidAmount}
//                             onChange={(e) => {
//                                 const parsedValue = parseInt(e.target.value);
//                                 if (!isNaN(parsedValue)) {
//                                     setMinBidAmount(parsedValue);
//                                 } else {
//                                     setMinBidAmount('');
//                                 }
//                             }}
//                         />
//                         <button onClick={createTender}>Create Tender</button>
//                     </div>
//                     <h3>All Tenders</h3>
//                     <ul>
//                         {tenders.map((tender, index) => (
//                             <li key={index}>
//                                 <p>Tender ID: {tender.id}</p>
//                                 <p>Description: {tender[1]}</p>
//                                 <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
//                                 <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
//                                 <p>Winner: {tender[4] !== ZERO_ADDRESS ? tender[4] : 'No winner yet'}</p>
//                                 {/* {tender[3] && <button onClick={() => viewBids(tender.id)}>View Bids</button>} */}
//                                 <button onClick={() => viewBids(tender.id)}>View Bids</button>

//                             </li>
//                         ))}
//                     </ul>

//                     {selectedTenderId && sortedBids.length > 0 && (
//                         <div>
//                             <h3>Bids for Tender ID: {selectedTenderId}</h3>
//                             <ul>
//                                 {sortedBids.map((bid, index) => (
//                                     <li key={index}>
//                                         <p>Bidder: {bid.bidder}</p>
//                                         <p>Bid Amount: {ethers.formatUnits(bid.amount, 'wei')} wei</p>
//                                         {tenders.find(tender => tender.id === selectedTenderId)?.[4] === ZERO_ADDRESS && (
//                                             <button onClick={() => selectWinner(selectedTenderId, bid.bidder)}>Select as Winner</button>
//                                         )}
//                                     </li>
//                                 ))}
//                             </ul>
//                         </div>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// }

// export default App;


//---------------------------------------------
import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useNavigate } from 'react-router-dom'; // If using React Router
import Tender from '../contractJson/Tender_Milestone.json'; // Replace with your ABI JSON file
const TenderABI = Tender.abi;

function TenderManagement() {


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

    const [wonTenders, setWonTenders] = useState([]); // Track tenders won by the current account

    const [estimateCost, setEstimateCost] = useState(0);
    const [finalCost, setFinalCost] = useState("");
    const [milestoneDesc, setMilestoneDesc] = useState("");
    const [fundsRequired, setFundsRequired] = useState("");
    const [milestones, setMilestones] = useState([]);

    const [bidInputs, setBidInputs] = useState({});



    // const contractAddress = '0x5D7c7167deE64C76CBff3825bcCD417B99B6c8e4'; // Replace with your deployed contract address
    const contractAddress = '0x74a5298D5468EAb1c06c802A3396fed01fa369c5'; // Replace with your deployed contract address
    const governmentOfficial = "0x7CbF50988586a13463E1f93B5d5F8bc523F49d10";
    const bidder1 = "0xb7d489b00a12dd2e4dd210dd77c7419c78215443";
    const public1 = "0x14758BD24d28D608E72038Ec49D24441dDeF418F";

    const navigate = useNavigate(); // Hook for navigation if using React Router

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

                await loadTenders(tenderContract, accounts[0]);
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
            loadTenders(contract, accounts[0]);
        });

        return () => {
            window.ethereum.removeListener('accountsChanged', connectWallet);
        };
    }, []);


    const loadTenders = async (tenderContract, currentAccount) => {
        if (tenderContract) {
            let tempTenders = [];
            let tempWonTenders = [];
            const totalTenders = await tenderContract.tenderCounter();
            for (let i = 1; i <= totalTenders; i++) {
                const tender = await tenderContract.getTenderDetails(i);
                // const formattedTender = {
                //     id: i,
                //     description: tender[1],
                //     minimumBid: tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A',
                //     isOpen: tender[3],
                //     winner: tender[4],
                // };
                // tempTenders.push(formattedTender);

                const formattedTender = { id: i, ...tender };
                tempTenders.push(formattedTender);

                // Check if the current account is the winner of this tender
                if (tender[4].toLowerCase() === currentAccount.toLowerCase()) {
                    tempWonTenders.push(formattedTender);
                }
            }
            setTenders(tempTenders);
            console.log("Tenders: ",tempTenders);
            setWonTenders(tempWonTenders);
        }
    };

    const handleTenderSelect = (tenderId) => {
        setSelectedTenderId(tenderId);
        navigate(`/milestones/${tenderId}?role=${userType}`); // Pass role as a query parameter
    };
    
    // const handleTenderSelect = (tenderId) => {
    //     setSelectedTenderId(tenderId);
    //     navigate(`/milestones/${tenderId}`); // Navigate to Milestone Management page
    // };

    const createTender = async () => {
        if (contract) {
            if (window.confirm("Are you sure you want to create this tender?")) {
                const tx = await contract.createTender(newTenderDesc, ethers.parseUnits(minBidAmount.toString(), 'wei'));
                await tx.wait();
                alert('Tender created successfully!');
                setNewTenderDesc('');
                setMinBidAmount('');
                await loadTenders(contract, account);
            }
        }
    };


    // const submitBid = async (tenderId) => {
    //     if (contract && bidAmount > 0) {
    //         if (window.confirm("Are you sure you want to submit your bid?")) {
    //             if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
    //                 alert('You can only bid once on a particular tender.');
    //                 return;
    //             }

    //             const tx = await contract.submitBid(tenderId, ethers.parseUnits(bidAmount.toString(), 'wei'), ethers.parseUnits(estimateCost.toString(), 'wei'));
    //             await tx.wait();
    //             alert('Bid submitted successfully!');
    //             setBidHistory((prev) => ({
    //                 ...prev,
    //                 [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
    //             }));
    //             setBidAmount('');
    //             setEstimateCost(''); // Clear the input fields
    //             await loadTenders(contract, account);
    //         }
    //     }
    // };

    // const submitBid = async (tenderId) => {
    //     if (contract && bidAmount > 0 && estimateCost > 0) {
    //         if (window.confirm("Are you sure you want to submit your bid?")) {
    //             if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
    //                 alert('You can only bid once on a particular tender.');
    //                 return;
    //             }
    
    //             try {
    //                 const tx = await contract.submitBid(
    //                     tenderId,
    //                     ethers.parseUnits(bidAmount.toString(), 'wei'),
    //                     ethers.parseUnits(estimateCost.toString(), 'wei') // Pass estimated cost
    //                 );
    //                 await tx.wait();
    //                 alert('Bid submitted successfully!');
    //                 setBidHistory((prev) => ({
    //                     ...prev,
    //                     [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
    //                 }));
    //                 setBidAmount('');
    //                 setEstimateCost(''); // Clear the input fields
    //                 await loadTenders(contract, account);
    //             } catch (error) {
    //                 console.error('Error submitting bid:', error);
    //                 alert('Failed to submit bid');
    //             }
    //         }
    //     } else {
    //         alert('Please enter valid bid and estimated cost values.');
    //     }
    // };

    const submitBid = async (tenderId, bidAmount, estimateCost) => {
        if (contract && bidAmount > 0 && estimateCost > 0) {
            if (window.confirm("Are you sure you want to submit your bid?")) {
                if (bidHistory[tenderId] && bidHistory[tenderId].includes(account)) {
                    alert('You can only bid once on a particular tender.');
                    return;
                }
    
                try {
                    const tx = await contract.submitBid(
                        tenderId,
                        ethers.parseUnits(bidAmount.toString(), 'wei'),
                        ethers.parseUnits(estimateCost.toString(), 'wei')
                    );
                    await tx.wait();
                    alert('Bid submitted successfully!');
                    setBidHistory((prev) => ({
                        ...prev,
                        [tenderId]: prev[tenderId] ? [...prev[tenderId], account] : [account],
                    }));
                    // Reset bid inputs for the tender after submission
                    setBidInputs((prev) => ({
                        ...prev,
                        [tenderId]: { bidAmount: '', estimateCost: '' },
                    }));
                    await loadTenders(contract, account);
                } catch (error) {
                    console.error('Error submitting bid:', error);
                    alert('Failed to submit bid');
                }
            }
        } else {
            alert('Please enter valid bid and estimated cost values.');
        }
    };
    
    

    const viewBids = async (tenderId) => {
        if (contract) {
            const rawBidsList = await contract.getBids(tenderId);
            console.log("rawList: ",rawBidsList);
            const bidsList = rawBidsList.map((bid) => ({
                bidder: bid.bidder || 'N/A',
                amount: bid.bidAmount ? ethers.formatUnits(bid.bidAmount, 'wei') : null,
                estimateCost: bid.estimatedCost ? ethers.formatUnits(bid.estimatedCost, 'wei') : null,

            }));
            const sorted = [...bidsList].sort((a, b) => a.amount - b.amount);
            
            setBids(bidsList);
            setSelectedTenderId(tenderId);
            setSortedBids(sorted);
            console.log("sorted: ",sorted);

        }
    };

    // const selectWinner = async (tenderId, winnerAddress) => {
    //     if (contract && userType==="official") {
    //         if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId}?`)) {
    //             try {
    //                 const tx = await contract.chooseWinner(tenderId, winnerAddress);
    //                 await tx.wait();
    //                 alert(`Winner selected successfully for tender ID ${tenderId}`);
    //                 setBids([]);
    //                 await loadTenders(contract, account);
    //             } catch (error) {
    //                 console.error('Error choosing winner:', error);
    //                 alert('Failed to select winner');
    //             }
    //         }
    //     }
    // };

    // const selectWinner = async (tenderId, winnerAddress) => {
    //     const finalCostInput = prompt('Enter the final cost for this tender in wei:');
    //     const finalCost = parseInt(finalCostInput);

    //     if (contract && userType === "official" && finalCost > 0) {
    //         if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId} with a final cost of ${finalCost} wei?`)) {
    //             try {
    //                 const tx = await contract.chooseWinner(
    //                     tenderId,
    //                     winnerAddress,
    //                     ethers.parseUnits(finalCost.toString(), 'wei') // Pass final cost
    //                 );
    //                 await tx.wait();
    //                 alert(`Winner selected successfully for tender ID ${tenderId}`);
    //                 setBids([]);
    //                 await loadTenders(contract, account);
    //             } catch (error) {
    //                 console.error('Error choosing winner:', error);
    //                 alert('Failed to select winner');
    //             }
    //         }
    //     } else {
    //         alert('Invalid final cost entered.');
    //     }
    // };

    const selectWinner = async (tenderId, winnerAddress) => {
        const finalCostInput = prompt('Enter the final cost for this tender in wei:');
        const finalCost = parseInt(finalCostInput);
        // console.log(ethers.parseUnits(finalCost.toString(), 'wei'));
        if (contract && userType === "official" && finalCost > 0) {
            if (window.confirm(`Are you sure you want to select this winner for tender ID ${tenderId} with a final cost of ${finalCost} wei?`)) {
                try {
                    const tx = await contract.chooseWinner(
                        tenderId,
                        winnerAddress,
                        // finalCost
                        ethers.parseUnits(finalCost.toString(), 'wei') // Pass final cost
                    );
                    console.log("Hi");
                    await tx.wait();
                    alert(`Winner selected successfully for tender ID ${tenderId}`);
                    setBids([]);
                    await loadTenders(contract, account);
                } catch (error) {
                    console.error('Error choosing winner:', error);
                    alert('Failed to select winner');
                }
            }
        } else {
            alert('Invalid final cost entered.');
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
                                <p>Estimated Cost: {tender[5] ? ethers.formatUnits(tender[5], 'wei') : 'N/A'} wei</p>
                                <p>Final Cost: {tender[6] ? ethers.formatUnits(tender[6], 'wei') : 'N/A'} wei</p>
                                <button onClick={() => handleTenderSelect(tender.id)}>View Milestones</button>
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
                                            // value={bidAmount}
                                            value={bidInputs[tender.id]?.bidAmount || ''}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value);
                                                console.log("Parsed: ",parsedValue);
                                                // if (!isNaN(parsedValue)) {
                                                //     setBidAmount(parsedValue);
                                                // } else {
                                                //     setBidAmount('');
                                                // }
                                                setBidInputs((prev) => ({
                                                    ...prev,
                                                    [tender.id]: {
                                                        ...prev[tender.id],
                                                        bidAmount: !isNaN(parsedValue) ? parsedValue : '',
                                                    },
                                                }));
                                            }}
                                        />
                                        <input
                                            type="text"
                                            placeholder="Estimated Cost in Wei"
                                            // value={estimateCost}
                                            value={bidInputs[tender.id]?.estimateCost || ''}
                                            onChange={(e) => {
                                                const parsedValue = parseInt(e.target.value);
                                                console.log("Parsed: ",parsedValue);

                                                // if (!isNaN(parsedVal)) {
                                                //     setEstimateCost(parsedVal);
                                                // } else {
                                                //     setEstimateCost('');
                                                // }
                                                setBidInputs((prev) => ({
                                                    ...prev,
                                                    [tender.id]: {
                                                        ...prev[tender.id],
                                                        estimateCost: !isNaN(parsedValue) ? parsedValue : '',
                                                    },
                                                }));
                                            }}
                                        />
                                        <button onClick={() => submitBid(tender.id,bidInputs[tender.id]?.bidAmount, bidInputs[tender.id]?.estimateCost)}>Submit Bid</button>
                                    </div>
                                )}
                                {/* Show View Milestones only for closed tenders */}
                                {!tender[3] && (
                                    <button onClick={() => handleTenderSelect(tender.id)}>View Milestones</button>
                                )}
                            </li>
                        ))}
                    </ul>
                    <h3>Won Tenders</h3>
                    <ul>
                        {wonTenders.map((tender) => (
                            <li key={tender.id}>
                                <p>Tender ID: {tender.id}</p>
                                <p>Description: {tender[1]}</p>
                                <button onClick={() => handleTenderSelect(tender.id)}>Create/View Milestones</button>
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
                        {tenders.map((tender) => (
                            <li key={tender.id}>
                                <p>Tender ID: {tender.id}</p>
                                <p>Description: {tender[1]}</p>
                                <p>Minimum Bid: {tender[2] ? ethers.formatUnits(tender[2], 'wei') : 'N/A'} wei</p>
                                <p>Status: {tender[3] ? 'Open' : 'Closed'}</p>
                                <p>Winner: {tender[4] !== ZERO_ADDRESS ? tender[4] : 'No winner yet'}</p>
                                <p>Estimated Cost: {tender[5] ? ethers.formatUnits(tender[5], 'wei') : 'N/A'} wei</p>
                                <p>Final Cost: {tender[6] ? ethers.formatUnits(tender[6], 'wei') : 'N/A'} wei</p>
                                {/* {tender[3] && <button onClick={() => viewBids(tender.id)}>View Bids</button>} */}
                                <button onClick={() => viewBids(tender.id)}>View Bids</button>
                                <button onClick={() => handleTenderSelect(tender.id)}>View Milestones</button>
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
                                        <p>Estimated Amount: {bid.estimateCost ? ethers.formatUnits(bid.estimateCost, 'wei') : 'N/A'} wei</p>
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

export default TenderManagement;
