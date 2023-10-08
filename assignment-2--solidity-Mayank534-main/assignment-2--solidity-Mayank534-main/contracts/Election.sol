
// SPDX-License-Identifier: GPL-3.0
pragma solidity >=0.7.0 <0.9.0;

contract Election {
    // This is a type for a single voter.
    struct Voter {
        bool registered; // if true, this voter is eligible to vote
        bool voted; // if true, this voter already voted
        uint256 vote; // index of the voted candidate
    }

    // This is a type for a single candidate.
    struct Candidate {
        string name; // short name (up to 32 bytes)
        uint256 votes; // total number of votes
    }

    // This is the leader (creator) of the election.
    address public leader;

    // This declares a state variable that
    // maps a `Voter` to each possible address.
    mapping(address => Voter) public voters;

    // A dynamically-sized array of `Candidate` structs.
    Candidate[] public candidates;

    /// Create a new election to choose one of `_candidateNames`.
    constructor(string[] memory _candidateNames) {
        leader = msg.sender;
        voters[leader].registered = true;

        // For each provided candidate name, create
        // a new `Candidate` and add it to the end
        // of the `voters` array.
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            // `Candidate({...})` creates a temporary
            // Candidate object and `candidates.push(...)`
            // appends it to the end of `candidates`.
            candidates.push(Candidate({name: _candidateNames[i], votes: 0}));
        }
    }

    // Grants the right to vote on this ballot to `voter`.
    // Can only be called by `leader`.
    function registerVoter(address voter) external {
        require(
            msg.sender == leader,
            "Only the election leader can grant voting rights."
        );
        require(!voters[voter].voted, "The voter already voted.");
        require(!voters[voter].registered, "Voter is already registered.");
        voters[voter].registered = true;
    }

    /// Give your vote
    /// to candidate `candidates[_candidate].name`.
    function castVote(uint256 _candidate) external {
        Voter storage voter = voters[msg.sender];
        require(voter.registered, "Voter is not registered.");
        require(!voter.voted, "Already voted.");
        require(_candidate < candidates.length, "Invalid candidate index.");

        voter.voted = true;
        voter.vote = _candidate;
        candidates[_candidate].votes += 1;
    }

    // Determine the winning candidate.
    function winningCandidate()
        public
        view
        returns (uint256 winningCandidate_)
    {
        require(candidates.length > 0, "No votes have been cast.");

        uint256 maxVotes = 0;
        uint256 winningIndex;

        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].votes > maxVotes) {
                maxVotes = candidates[i].votes;
                winningIndex = i;
            }
        }
        require(maxVotes > 0, "No votes have been cast.");

        return winningIndex;
    }

    // Calls winningCandidate() function to get the index
    // of the winner and then returns the name of the winner.
    function winningCandidateName()
        external
        view
        returns (string memory winnerName_)
    {   
        uint256 winningIndex = winningCandidate();
        winnerName_ = candidates[winningIndex].name;
    }
}
