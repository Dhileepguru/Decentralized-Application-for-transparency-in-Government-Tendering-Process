// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract Tender {
    struct TenderDetails {
        uint id;
        string description;
        uint minBidAmount;
        bool isOpen;
        address winner;
    }

    struct Bid {
        uint tenderId;
        address bidder;
        uint bidAmount;
    }

    uint public tenderCounter;
    mapping(uint => TenderDetails) public tenders;
    mapping(uint => Bid[]) public bids;

    address public governmentOfficial;

    constructor() {
        governmentOfficial = msg.sender;
    }

    modifier onlyGovernmentOfficial() {
        require(msg.sender == governmentOfficial, "Only government officials can perform this action");
        _;
    }

    function createTender(string memory description, uint minBidAmount) public onlyGovernmentOfficial {
        tenderCounter++;
        tenders[tenderCounter] = TenderDetails(tenderCounter, description, minBidAmount, true, address(0));
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

        // Check if the selected address is a valid bidder
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
    // function selectWinner(uint tenderId) public onlyGovernmentOfficial {
    //     require(tenders[tenderId].isOpen, "Tender is already closed");

    //     uint lowestBid = type(uint).max;
    //     address lowestBidder;

    //     for(uint i=0; i< bids[tenderId].length; i++){
    //         if(bids[tenderId][i].bidAmount < lowestBid){
    //             lowestBid = bids[tenderId][i].bidAmount;
    //             lowestBidder = bids[tenderId][i].bidder;
    //         }
    //     }

    //     tenders[tenderId].winner = lowestBidder;
    //     tenders[tenderId].isOpen = false;
    // }
}
