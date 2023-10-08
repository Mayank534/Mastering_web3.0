// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Election {
    struct Voter {
        bool registered; // if true, this voter is eligible to vote
        bool voted; // if true, this voter already voted
        uint256[3] candidateVotes; // Stores candidate IDs with their preference points (5, 3, or 1)
    }

    struct Candidate {
        string name; // short name (up to 32 bytes)
        uint256 totalVotes; // total number of votes received
    }

    address public leader;
    mapping(address => Voter) public voters;
    Candidate[] public candidates;

    constructor(string[] memory _candidateNames) {
        leader = msg.sender;
        voters[leader].registered = true;

        // For each provided candidate name, create
        // a new `Candidate` and add it to the end
        // of the `candidates` array.
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            // `Candidate({...})` creates a temporary
            // Candidate object and `candidates.push(...)`
            // appends it to the end of `candidates`.
            candidates.push(Candidate({name: _candidateNames[i], totalVotes: 0}));
        }
    }

    function registerVoter(address voter) external {
        require(
            msg.sender == leader,
            "Only the election leader can grant voting rights."
        );
        require(
            !voters[voter].voted,
            "The voter has already voted and cannot be registered."
        );
        require(
            !voters[voter].registered,
            "Voter is already registered."
        );

        // Register a voter with the given address by setting
        // the `registered` field of the corresponding Voter to true.
        voters[voter].registered = true;
    }

    /// Give your vote to 3 candidates.
    /// The candidate at index `_candidate1` gets 5 points,
    /// `_candidate2` gets 3 points, and `_candidate3` gets 1 point.
    function castVote(uint256 _candidate1, uint256 _candidate2, uint256 _candidate3) external {
        Voter storage voter = voters[msg.sender];
        require(voter.registered, "Voter is not registered.");
        require(!voter.voted, "Already voted.");
        require(
            _candidate1 != _candidate2 &&
            _candidate1 != _candidate3 &&
            _candidate2 != _candidate3,
            "Candidates must be distinct."
        );

        // Assign 5, 3, and 1 points to the selected candidates.
        voter.voted = true;
        voter.candidateVotes[0] = _candidate1;
        voter.candidateVotes[1] = _candidate2;
        voter.candidateVotes[2] = _candidate3;

        // Increment the vote count for the selected candidates.
        candidates[_candidate1].totalVotes += 5;
        candidates[_candidate2].totalVotes += 3;
        candidates[_candidate3].totalVotes += 1;
    }

    // Determine the winning candidate.
    function winningCandidate() public view returns (uint256 winningCandidate_) {
        require(candidates.length > 0, "No candidates in the election.");
        uint256 maxVotes = 0;
        uint256 winningIndex;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].totalVotes > maxVotes) {
                maxVotes = candidates[i].totalVotes;
                winningIndex = i;
            }
        }

    return winningIndex;
    }

    function winningCandidateName() external view returns (string memory winnerName_) {
    uint256 winningIndex = winningCandidate();

    // Check if any votes have been cast
    for (uint256 i = 0; i < candidates.length; i++) {
        if (candidates[i].totalVotes > 0) {
        return candidates[winningIndex].name;
        }
    }

    revert("No votes have been cast.");
    }


}
