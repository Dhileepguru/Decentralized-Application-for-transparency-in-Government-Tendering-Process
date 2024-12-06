import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import TenderContract from '../contractJson/Tender_Milestone.json';

const MilestoneManagement = () => {
    const [milestones, setMilestones] = useState([]);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const contractAddress = '0x71106C97353b423c9f8263652Ac963779fb8dfC5';

    useEffect(() => {
        const fetchMilestones = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(contractAddress, TenderContract.abi, provider);
            const data = await contract.getMilestones(1); // Assuming tenderId = 1
            setMilestones(data);
        };

        fetchMilestones();
    }, []);

    const createMilestone = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, TenderContract.abi, signer);
        await contract.createMilestone(1, description, ethers.utils.parseEther(amount));
    };

    return (
        <div>
            <h1>Milestone Management</h1>
            <form onSubmit={createMilestone}>
                <input
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button type="submit">Create Milestone</button>
            </form>
            <h2>Milestones</h2>
            <ul>
                {milestones.map((ms, index) => (
                    <li key={index}>{ms.description} - {ethers.utils.formatEther(ms.amount)} ETH</li>
                ))}
            </ul>
        </div>
    );
};

export default MilestoneManagement;
