// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract VotingMonumentsDAO {
    
    struct Monument {
        uint256 id;
        string name;
        string region;
        string dataURI; // JSON metadata stored on IPFS
        address addedBy;
        uint256 timestamp;
        bool approved;
    }
    
    struct Proposal {
        uint256 id;
        string name;
        string region;
        string dataURI; // JSON metadata stored on IPFS
        address proposer;
        uint256 votesFor;
        uint256 votesAgainst;
        uint256 endTime;
        bool executed;
        mapping(address => bool) hasVoted;
    }
    
    struct Region {
        string name;
        uint256 monumentCount;
        bool exists;
    }
    
    // Storage
    mapping(uint256 => Monument) public monuments;
    mapping(uint256 => Proposal) public proposals;
    mapping(string => Region) public regions;
    mapping(string => uint256[]) public regionMonuments;
    mapping(address => bool) public isDAOMember;
    
    uint256 public totalMonuments;
    uint256 public totalProposals;
    uint256 public votingPeriod = 3 days;
    uint256 public minVotes = 3;
    address public owner;
    
    event ProposalCreated(uint256 indexed proposalId, address proposer, string name);
    event VoteCast(uint256 indexed proposalId, address voter, bool support);
    event ProposalExecuted(uint256 indexed proposalId, bool approved);
    event MonumentApproved(uint256 indexed monumentId, string name);
    event DAOMemberAdded(address member);
    event RegionCreated(string name);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this");
        _;
    }
    
    modifier onlyDAOMember() {
        require(isDAOMember[msg.sender], "Only DAO members can vote");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        isDAOMember[msg.sender] = true; // Owner is first DAO member
    }
    
    // Add DAO members (only owner can add initially)
    function addDAOMember(address _member) external onlyOwner {
        require(_member != address(0), "Invalid address");
        require(!isDAOMember[_member], "Already a DAO member");
        isDAOMember[_member] = true;
        emit DAOMemberAdded(_member);
    }
    
    // Create regions (only owner)
    function addRegion(string memory _regionName) external onlyOwner {
        require(bytes(_regionName).length > 0, "Region name cannot be empty");
        require(!regions[_regionName].exists, "Region already exists");
        
        regions[_regionName] = Region({
            name: _regionName,
            monumentCount: 0,
            exists: true
        });
        
        emit RegionCreated(_regionName);
    }
    
    // Anyone can propose a monument with IPFS metadata
    function proposeMonument(
        string memory _name,
        string memory _region,
        string memory _dataURI
    ) external {
        // Input validation
        require(bytes(_name).length > 0 && bytes(_name).length <= 100, "Invalid name length");
        require(bytes(_region).length > 0, "Region cannot be empty");
        require(bytes(_dataURI).length > 0 && bytes(_dataURI).length <= 200, "Invalid IPFS hash length");
        require(regions[_region].exists, "Region does not exist");
        
        // Check for gas limit issues - ensure voting period is reasonable
        require(votingPeriod > 0 && votingPeriod <= 30 days, "Invalid voting period");
        
        totalProposals++;
        
        Proposal storage newProposal = proposals[totalProposals];
        newProposal.id = totalProposals;
        newProposal.name = _name;
        newProposal.region = _region;
        newProposal.dataURI = _dataURI;
        newProposal.proposer = msg.sender;
        newProposal.endTime = block.timestamp + votingPeriod;
        newProposal.executed = false; // Explicitly set to false
        
        emit ProposalCreated(totalProposals, msg.sender, _name);
    }
    
    // DAO members vote on proposals
    function vote(uint256 _proposalId, bool _support) external onlyDAOMember {
        require(_proposalId > 0 && _proposalId <= totalProposals, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];
        require(block.timestamp <= proposal.endTime, "Voting period ended");
        require(!proposal.executed, "Proposal already executed");
        require(!proposal.hasVoted[msg.sender], "Already voted");
        
        proposal.hasVoted[msg.sender] = true;
        
        if (_support) {
            proposal.votesFor++;
        } else {
            proposal.votesAgainst++;
        }
        
        emit VoteCast(_proposalId, msg.sender, _support);
    }
    
    // Execute proposal after voting period - FIXED VERSION
    function executeProposal(uint256 _proposalId) external {
        // Input validation
        require(_proposalId > 0 && _proposalId <= totalProposals, "Invalid proposal");
        
        Proposal storage proposal = proposals[_proposalId];
        
        // State validation
        require(block.timestamp > proposal.endTime, "Voting period not ended");
        require(!proposal.executed, "Proposal already executed");
        require(
            proposal.votesFor + proposal.votesAgainst >= minVotes, 
            "Not enough votes"
        );
        
        // Mark as executed FIRST to prevent reentrancy
        proposal.executed = true;
        
        bool approved = proposal.votesFor > proposal.votesAgainst;
        
        if (approved) {
            // Validate region still exists
            require(regions[proposal.region].exists, "Region no longer exists");
            
            // Add monument to the system
            totalMonuments++;
            
            monuments[totalMonuments] = Monument({
                id: totalMonuments,
                name: proposal.name,
                region: proposal.region,
                dataURI: proposal.dataURI,
                addedBy: proposal.proposer,
                timestamp: block.timestamp,
                approved: true
            });
            
            // Update region data
            regionMonuments[proposal.region].push(totalMonuments);
            regions[proposal.region].monumentCount++;
            
            emit MonumentApproved(totalMonuments, proposal.name);
        }
        
        emit ProposalExecuted(_proposalId, approved);
    }
    
    // View functions
    function getMonument(uint256 _id) external view returns (
        string memory name,
        string memory region,
        string memory dataURI,
        address addedBy,
        uint256 timestamp,
        bool approved
    ) {
        require(_id > 0 && _id <= totalMonuments, "Monument does not exist");
        Monument memory monument = monuments[_id];
        
        return (
            monument.name,
            monument.region,
            monument.dataURI,
            monument.addedBy,
            monument.timestamp,
            monument.approved
        );
    }
    
    function getProposal(uint256 _proposalId) external view returns (
        string memory name,
        string memory region,
        string memory dataURI,
        address proposer,
        uint256 votesFor,
        uint256 votesAgainst,
        uint256 endTime,
        bool executed
    ) {
        require(_proposalId > 0 && _proposalId <= totalProposals, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];
        
        return (
            proposal.name,
            proposal.region,
            proposal.dataURI,
            proposal.proposer,
            proposal.votesFor,
            proposal.votesAgainst,
            proposal.endTime,
            proposal.executed
        );
    }
    
    function getMonumentsByRegion(string memory _region) external view returns (uint256[] memory) {
        require(regions[_region].exists, "Region does not exist");
        return regionMonuments[_region];
    }
    
    function getActiveProposals() external view returns (uint256[] memory) {
        uint256[] memory activeProposals = new uint256[](totalProposals);
        uint256 count = 0;
        
        for (uint256 i = 1; i <= totalProposals; i++) {
            if (!proposals[i].executed && block.timestamp <= proposals[i].endTime) {
                activeProposals[count] = i;
                count++;
            }
        }
        
        // Resize array to actual count
        uint256[] memory result = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = activeProposals[i];
        }
        
        return result;
    }
    
    function canVote(address _voter, uint256 _proposalId) external view returns (bool) {
        if (!isDAOMember[_voter]) return false;
        if (_proposalId == 0 || _proposalId > totalProposals) return false;
        
        Proposal storage proposal = proposals[_proposalId];
        return !proposal.hasVoted[_voter] && 
               !proposal.executed && 
               block.timestamp <= proposal.endTime;
    }
    
    // Helper function to check proposal status
    function getProposalStatus(uint256 _proposalId) external view returns (
        bool isActive,
        bool canExecute,
        bool hasEnoughVotes,
        uint256 timeLeft
    ) {
        require(_proposalId > 0 && _proposalId <= totalProposals, "Invalid proposal");
        Proposal storage proposal = proposals[_proposalId];
        
        isActive = !proposal.executed && block.timestamp <= proposal.endTime;
        canExecute = !proposal.executed && 
                     block.timestamp > proposal.endTime && 
                     (proposal.votesFor + proposal.votesAgainst) >= minVotes;
        hasEnoughVotes = (proposal.votesFor + proposal.votesAgainst) >= minVotes;
        
        if (block.timestamp <= proposal.endTime) {
            timeLeft = proposal.endTime - block.timestamp;
        } else {
            timeLeft = 0;
        }
    }
    
    // Admin functions
    function setVotingPeriod(uint256 _newPeriod) external onlyOwner {
        require(_newPeriod > 0 && _newPeriod <= 30 days, "Invalid voting period");
        votingPeriod = _newPeriod;
    }
    
    function setMinVotes(uint256 _minVotes) external onlyOwner {
        require(_minVotes > 0 && _minVotes <= 100, "Invalid minimum votes");
        minVotes = _minVotes;
    }
    
    // Emergency function to check contract state
    function getContractStats() external view returns (
        uint256 totalMons,
        uint256 totalProps,
        uint256 votePeriod,
        uint256 minVotesReq,
        address contractOwner
    ) {
        return (totalMonuments, totalProposals, votingPeriod, minVotes, owner);
    }
}