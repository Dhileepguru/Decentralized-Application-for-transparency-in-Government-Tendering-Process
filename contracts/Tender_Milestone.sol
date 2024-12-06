// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Tender_Milestone {
    struct TenderDetails {
        uint id;
        string description;
        uint minBidAmount;
        bool isOpen;
        address winner;
        uint totalFunds;
    }

    struct Milestone {
        uint id;
        string description;
        uint amount;
        bool isCompleted;
    }

    struct Bid {
        uint tenderId;
        address bidder;
        uint bidAmount;
    }

    uint public tenderCounter;
    mapping(uint => TenderDetails) public tenders;
    mapping(uint => Bid[]) public bids;
    mapping(uint => Milestone[]) public milestones;

    address public governmentOfficial;

    constructor() {
        governmentOfficial = msg.sender;
    }

    modifier onlyGovernmentOfficial() {
        require(msg.sender == governmentOfficial, "Only government officials can perform this action");
        _;
    }

    modifier onlyWinner(uint tenderId) {
        require(msg.sender == tenders[tenderId].winner, "Only the project winner can perform this action");
        _;
    }

    function createTender(string memory description, uint minBidAmount, uint totalFunds) public onlyGovernmentOfficial {
        tenderCounter++;
        tenders[tenderCounter] = TenderDetails(tenderCounter, description, minBidAmount, true, address(0), totalFunds);
    }

    function submitBid(uint tenderId, uint bidAmount) public {
        require(tenders[tenderId].isOpen, "Tender is closed");
        require(bidAmount >= tenders[tenderId].minBidAmount, "Bid amount is too low");

        bids[tenderId].push(Bid(tenderId, msg.sender, bidAmount));
    }

    function getTenderDetails(uint tenderId) public view returns (TenderDetails memory) {
        return tenders[tenderId];
    }

    function getBids(uint tenderId) public view returns (Bid[] memory) {
        return bids[tenderId];
    }

    function chooseWinner(uint tenderId, address winnerAddress) public onlyGovernmentOfficial {
        require(tenders[tenderId].isOpen, "Tender is already closed");

        bool validBidder = false;
        for (uint i = 0; i < bids[tenderId].length; i++) {
            if (bids[tenderId][i].bidder == winnerAddress) {
                validBidder = true;
                break;
            }
        }
        require(validBidder, "Selected address is not a valid bidder");

        tenders[tenderId].winner = winnerAddress;
        tenders[tenderId].isOpen = false;
    }

    function createMilestone(uint tenderId, string memory description, uint amount) public onlyWinner(tenderId) {
        require(amount <= tenders[tenderId].totalFunds, "Insufficient funds for this milestone");
        milestones[tenderId].push(Milestone(milestones[tenderId].length + 1, description, amount, false));
    }

    function getMilestones(uint tenderId) public view returns (Milestone[] memory) {
        return milestones[tenderId];
    }

    function approveMilestone(uint tenderId, uint milestoneId) public onlyGovernmentOfficial {
        require(milestones[tenderId][milestoneId - 1].isCompleted == false, "Milestone already completed");
        milestones[tenderId][milestoneId - 1].isCompleted = true;
        tenders[tenderId].totalFunds -= milestones[tenderId][milestoneId - 1].amount;
        payable(tenders[tenderId].winner).transfer(milestones[tenderId][milestoneId - 1].amount);
    }

    receive() external payable {}
}
