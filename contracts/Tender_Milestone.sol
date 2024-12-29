// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.27;

// contract Tender_Milestone {
//     struct TenderDetails {
//         uint id;
//         string description;
//         uint minBidAmount;
//         bool isOpen;
//         address winner;
//         uint totalFunds;
//     }

//     struct Milestone {
//         uint id;
//         string description;
//         uint amount;
//         bool isCompleted;
//     }

//     struct Bid {
//         uint tenderId;
//         address bidder;
//         uint bidAmount;
//     }

//     uint public tenderCounter;
//     mapping(uint => TenderDetails) public tenders;
//     mapping(uint => Bid[]) public bids;
//     mapping(uint => Milestone[]) public milestones;

//     address public governmentOfficial;

//     event TenderCreated(
//         uint indexed tenderId,
//         string description,
//         uint minBidAmount,
//         uint totalFunds
//     );
//     event BidSubmitted(
//         uint indexed tenderId,
//         address indexed bidder,
//         uint bidAmount
//     );
//     event WinnerChosen(uint indexed tenderId, address indexed winner);
//     event MilestoneCreated(
//         uint indexed tenderId,
//         uint milestoneId,
//         string description,
//         uint amount
//     );
//     event MilestoneApproved(
//         uint indexed tenderId,
//         uint milestoneId,
//         uint amount
//     );
//     event DepositReceived(address indexed from, uint amount);

//     constructor() {
//         governmentOfficial = msg.sender;
//     }

//     modifier onlyGovernmentOfficial() {
//         require(
//             msg.sender == governmentOfficial,
//             "Only government officials can perform this action"
//         );
//         _;
//     }

//     modifier onlyWinner(uint tenderId) {
//         require(
//             msg.sender == tenders[tenderId].winner,
//             "Only the project winner can perform this action"
//         );
//         _;
//     }

//     function createTender(string memory description, uint minBidAmount, uint totalFunds) public onlyGovernmentOfficial {
//         tenderCounter++;
//         tenders[tenderCounter] = TenderDetails(tenderCounter, description, minBidAmount, true, address(0), totalFunds);
//     }

//     public onlyGovernmentOfficial {
//         tenderCounter++;
//         tenders[tenderCounter] = TenderDetails(
//             tenderCounter,
//             description,
//             minBidAmount,
//             true,
//             payable(address(0)),
//             totalFunds
//         );
//         emit TenderCreated(
//             tenderCounter,
//             description,
//             minBidAmount,
//             totalFunds
//         );
//     }

//     function submitBid(uint tenderId, uint bidAmount) public {
//         require(tenders[tenderId].isOpen, "Tender is closed");
//         require(
//             bidAmount >= tenders[tenderId].minBidAmount,
//             "Bid amount is too low"
//         );

//         bids[tenderId].push(Bid(tenderId, msg.sender, bidAmount));
//         emit BidSubmitted(tenderId, msg.sender, bidAmount);
//     }

//     function getTenderDetails(
//         uint tenderId
//     ) public view returns (TenderDetails memory) {
//         return tenders[tenderId];
//     }

//     function getBids(uint tenderId) public view returns (Bid[] memory) {
//         return bids[tenderId];
//     }

//     function chooseWinner(
//         uint tenderId,
//         address payable winnerAddress
//     ) public onlyGovernmentOfficial {
//         require(tenders[tenderId].isOpen, "Tender is already closed");

//         bool validBidder = false;
//         for (uint i = 0; i < bids[tenderId].length; i++) {
//             if (bids[tenderId][i].bidder == winnerAddress) {
//                 validBidder = true;
//                 break;
//             }
//         }
//         require(validBidder, "Selected address is not a valid bidder");

//         tenders[tenderId].winner = winnerAddress;
//         tenders[tenderId].isOpen = false;
//         emit WinnerChosen(tenderId, winnerAddress);
//     }

//     function createMilestone(
//         uint tenderId,
//         string memory description,
//         uint amount
//     ) public onlyWinner(tenderId) {
//         require(
//             amount <= tenders[tenderId].totalFunds,
//             "Insufficient funds for this milestone"
//         );
//         milestones[tenderId].push(
//             Milestone(
//                 milestones[tenderId].length + 1,
//                 description,
//                 amount,
//                 false
//             )
//         );
//         emit MilestoneCreated(
//             tenderId,
//             milestones[tenderId].length,
//             description,
//             amount
//         );
//     }

//     function getMilestones(
//         uint tenderId
//     ) public view returns (Milestone[] memory) {
//         return milestones[tenderId];
//     }

//     function approveMilestone(
//         uint tenderId,
//         uint milestoneId
//     ) public onlyGovernmentOfficial {
//         require(
//             milestones[tenderId][milestoneId - 1].isCompleted == false,
//             "Milestone already completed"
//         );
//         milestones[tenderId][milestoneId - 1].isCompleted = true;
//         tenders[tenderId].totalFunds -= milestones[tenderId][milestoneId - 1]
//             .amount;
//         payable(tenders[tenderId].winner).transfer(
//             milestones[tenderId][milestoneId - 1].amount
//         );
//         emit MilestoneApproved(
//             tenderId,
//             milestoneId,
//             milestones[tenderId][milestoneId - 1].amount
//         );
//     }

//     receive() external payable {
//         emit DepositReceived(msg.sender, msg.value);
//     }
// }

//----------------------------
// pragma solidity ^0.8.27;

// contract Tender_Milestone {
//     struct TenderDetails {
//         uint id;
//         string description;
//         uint minBidAmount;
//         bool isOpen;
//         address winner;
//         uint totalFunds;
//     }

//     struct Milestone {
//         uint id;
//         string description;
//         uint amount;
//         bool isCompleted;
//     }

//     struct Bid {
//         uint tenderId;
//         address bidder;
//         uint bidAmount;
//     }

//     uint public tenderCounter;
//     mapping(uint => TenderDetails) public tenders;
//     mapping(uint => Bid[]) public bids;
//     mapping(uint => Milestone[]) public milestones;

//     address public governmentOfficial;

//     constructor() {
//         governmentOfficial = msg.sender;
//     }

//     modifier onlyGovernmentOfficial() {
//         require(
//             msg.sender == governmentOfficial,
//             "Only government officials can perform this action"
//         );
//         _;
//     }

//     modifier onlyWinner(uint tenderId) {
//         require(
//             msg.sender == tenders[tenderId].winner,
//             "Only the project winner can perform this action"
//         );
//         _;
//     }

//     function createTender(
//         string memory description,
//         uint minBidAmount,
//         uint totalFunds
//     ) public onlyGovernmentOfficial {
//         tenderCounter++;
//         tenders[tenderCounter] = TenderDetails(
//             tenderCounter,
//             description,
//             minBidAmount,
//             true,
//             address(0),
//             totalFunds
//         );
//     }

//     function submitBid(uint tenderId, uint bidAmount) public {
//         require(tenders[tenderId].isOpen, "Tender is closed");
//         require(
//             bidAmount >= tenders[tenderId].minBidAmount,
//             "Bid amount is too low"
//         );

//         bids[tenderId].push(Bid(tenderId, msg.sender, bidAmount));
//     }

//     function getTenderDetails(
//         uint tenderId
//     ) public view returns (TenderDetails memory) {
//         return tenders[tenderId];
//     }

//     function getBids(uint tenderId) public view returns (Bid[] memory) {
//         return bids[tenderId];
//     }

//     function chooseWinner(
//         uint tenderId,
//         address winnerAddress
//     ) public onlyGovernmentOfficial {
//         require(tenders[tenderId].isOpen, "Tender is already closed");

//         bool validBidder = false;
//         for (uint i = 0; i < bids[tenderId].length; i++) {
//             if (bids[tenderId][i].bidder == winnerAddress) {
//                 validBidder = true;
//                 break;
//             }
//         }
//         require(validBidder, "Selected address is not a valid bidder");

//         tenders[tenderId].winner = winnerAddress;
//         tenders[tenderId].isOpen = false;
//     }

//     function createMilestone(
//         uint tenderId,
//         string memory description,
//         uint amount
//     ) public onlyWinner(tenderId) {
//         require(
//             amount <= tenders[tenderId].totalFunds,
//             "Insufficient funds for this milestone"
//         );
//         milestones[tenderId].push(
//             Milestone(
//                 milestones[tenderId].length + 1,
//                 description,
//                 amount,
//                 false
//             )
//         );
//     }

//     function getMilestones(
//         uint tenderId
//     ) public view returns (Milestone[] memory) {
//         return milestones[tenderId];
//     }

//     function approveMilestone(
//         uint tenderId,
//         uint milestoneId
//     ) public onlyGovernmentOfficial {
//         require(
//             milestones[tenderId][milestoneId - 1].isCompleted == false,
//             "Milestone already completed"
//         );
//         milestones[tenderId][milestoneId - 1].isCompleted = true;
//         tenders[tenderId].totalFunds -= milestones[tenderId][milestoneId - 1]
//             .amount;
//         payable(tenders[tenderId].winner).transfer(
//             milestones[tenderId][milestoneId - 1].amount
//         );
//     }

//     receive() external payable {}
// }
//----------------------------------------

// pragma solidity ^0.8.27;

// contract Tender_Milestone {
//     struct TenderDetails {
//         uint id;
//         string description;
//         uint minBidAmount;
//         bool isOpen;
//         address winner;
//         uint totalFunds;
//     }

//     struct Milestone {
//         uint id;
//         string description;
//         uint amount;
//         bool isCompleted;
//     }

//     struct Bid {
//         uint tenderId;
//         address bidder;
//         uint bidAmount;
//     }

//     uint public tenderCounter;
//     mapping(uint => TenderDetails) public tenders;
//     mapping(uint => Bid[]) public bids;
//     mapping(uint => Milestone[]) public milestones;

//     address public governmentOfficial;

//     constructor() {
//         governmentOfficial = msg.sender;
//     }

//     modifier onlyGovernmentOfficial() {
//         require(
//             msg.sender == governmentOfficial,
//             "Only government officials can perform this action"
//         );
//         _;
//     }

//     modifier onlyWinner(uint tenderId) {
//         require(
//             msg.sender == tenders[tenderId].winner,
//             "Only the project winner can perform this action"
//         );
//         _;
//     }

//     function createTender(
//         string memory description,
//         uint minBidAmount,
//         uint totalFunds
//     ) public onlyGovernmentOfficial {
//         tenderCounter++;
//         tenders[tenderCounter] = TenderDetails(
//             tenderCounter,
//             description,
//             minBidAmount,
//             true,
//             address(0),
//             totalFunds
//         );
//     }

//     function submitBid(uint tenderId, uint bidAmount) public {
//         require(tenders[tenderId].isOpen, "Tender is closed");
//         require(
//             bidAmount >= tenders[tenderId].minBidAmount,
//             "Bid amount is too low"
//         );

//         bids[tenderId].push(Bid(tenderId, msg.sender, bidAmount));
//     }

//     function getTenderDetails(
//         uint tenderId
//     ) public view returns (TenderDetails memory) {
//         return tenders[tenderId];
//     }

//     function getBids(uint tenderId) public view returns (Bid[] memory) {
//         return bids[tenderId];
//     }

//     function chooseWinner(
//         uint tenderId,
//         address winnerAddress
//     ) public onlyGovernmentOfficial {
//         require(tenders[tenderId].isOpen, "Tender is already closed");

//         bool validBidder = false;
//         for (uint i = 0; i < bids[tenderId].length; i++) {
//             if (bids[tenderId][i].bidder == winnerAddress) {
//                 validBidder = true;
//                 break;
//             }
//         }
//         require(validBidder, "Selected address is not a valid bidder");

//         tenders[tenderId].winner = winnerAddress;
//         tenders[tenderId].isOpen = false;
//     }

//     function createMilestone(
//         uint tenderId,
//         string memory description,
//         uint amount
//     ) public onlyWinner(tenderId) {
//         require(
//             amount <= tenders[tenderId].totalFunds,
//             "Insufficient funds for this milestone"
//         );
//         milestones[tenderId].push(
//             Milestone(
//                 milestones[tenderId].length + 1,
//                 description,
//                 amount,
//                 false
//             )
//         );
//     }

//     function getMilestones(
//         uint tenderId
//     ) public view returns (Milestone[] memory) {
//         return milestones[tenderId];
//     }

//     function approveMilestone(
//         uint tenderId,
//         uint milestoneId
//     ) public onlyGovernmentOfficial {
//         require(
//             milestones[tenderId][milestoneId - 1].isCompleted == false,
//             "Milestone already completed"
//         );
//         milestones[tenderId][milestoneId - 1].isCompleted = true;
//         tenders[tenderId].totalFunds -= milestones[tenderId][milestoneId - 1]
//             .amount;
//         payable(tenders[tenderId].winner).transfer(
//             milestones[tenderId][milestoneId - 1].amount
//         );
//     }

//     receive() external payable {}
// }

//-----------------------------------
pragma solidity ^0.8.27;

contract Tender_Milestone {
    struct TenderDetails {
        uint id;
        string description;
        uint minBidAmount;
        bool isOpen;
        address winner;
        uint estimateCost; // Added estimated cost
        uint finalCost; // Added final cost
    }

    struct Bid {
        uint tenderId;
        address bidder;
        uint bidAmount;
        uint estimatedCost; // Bidder's estimated cost
    }

    struct Milestone {
        string description; // Milestone description
        uint fundRequested; // Amount of funds requested
        bool isApproved; // Whether the milestone is approved
    }

    uint public tenderCounter;
    mapping(uint => TenderDetails) public tenders;
    mapping(uint => Bid[]) public bids;
    mapping(uint => Milestone[]) public milestones; // Milestones for each tender

    address public governmentOfficial;

    constructor() {
        governmentOfficial = msg.sender;
    }

    modifier onlyGovernmentOfficial() {
        require(
            msg.sender == governmentOfficial,
            "Only government officials can perform this action"
        );
        _;
    }

    modifier onlyWinner(uint tenderId) {
        require(
            msg.sender == tenders[tenderId].winner,
            "Only the winning bidder can perform this action"
        );
        _;
    }

    function createTender(
        string memory description,
        uint minBidAmount
    ) public onlyGovernmentOfficial {
        tenderCounter++;
        tenders[tenderCounter] = TenderDetails(
            tenderCounter,
            description,
            minBidAmount,
            true,
            address(0),
            0,
            0 // Final cost not set initially
        );
    }

    function submitBid(
        uint tenderId,
        uint bidAmount,
        uint estimatedCost
    ) public {
        require(tenders[tenderId].isOpen, "Tender is closed");
        require(
            bidAmount >= tenders[tenderId].minBidAmount,
            "Bid amount is too low"
        );
        require(
            estimatedCost >= bidAmount,
            "Estimated cost should be greater than or equal to the bid amount"
        );

        bids[tenderId].push(
            Bid(tenderId, msg.sender, bidAmount, estimatedCost)
        );
    }

    function getTenderDetails(
        uint tenderId
    ) public view returns (TenderDetails memory) {
        return tenders[tenderId];
    }

    function getBids(uint tenderId) public view returns (Bid[] memory) {
        return bids[tenderId];
    }

    function chooseWinner(
        uint tenderId,
        address winnerAddress,
        uint finalCost
    ) public onlyGovernmentOfficial {
        require(tenders[tenderId].isOpen, "Tender is already closed");

        bool validBidder = false;
        uint winnerEstimateCost;

        // Check if the selected address is a valid bidder and get their estimated cost
        for (uint i = 0; i < bids[tenderId].length; i++) {
            if (bids[tenderId][i].bidder == winnerAddress) {
                validBidder = true;
                winnerEstimateCost = bids[tenderId][i].estimatedCost;
                break;
            }
        }

        require(validBidder, "Selected address is not a valid bidder");

        require(
            finalCost >= winnerEstimateCost,
            "Final cost must be greater than or equal to the winner's estimated cost"
        );
        // Assign winner and costs
        tenders[tenderId].winner = winnerAddress;
        tenders[tenderId].isOpen = false;
        tenders[tenderId].estimateCost = winnerEstimateCost;
        tenders[tenderId].finalCost = finalCost;
    }

    function addMilestone(
        uint tenderId,
        string memory description,
        uint fundRequested
    ) public onlyWinner(tenderId) {
        milestones[tenderId].push(Milestone(description, fundRequested, false));
    }

    function getMilestones(
        uint tenderId
    ) public view returns (Milestone[] memory) {
        return milestones[tenderId];
    }

    function approveMilestone(
        uint tenderId,
        uint milestoneIndex
    ) public onlyGovernmentOfficial {
        require(
            milestoneIndex < milestones[tenderId].length,
            "Invalid milestone index"
        );
        require(
            !milestones[tenderId][milestoneIndex].isApproved,
            "Milestone already approved"
        );

        milestones[tenderId][milestoneIndex].isApproved = true;
    }
}
