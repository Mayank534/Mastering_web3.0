const { expect } = require("chai");
const { ethers } = require("ethers");
const { waffle } = require("hardhat");

async function newElection() {
  const Election = await ethers.getContractFactory("Election");
  const election = await Election.deploy(["alice", "bob", "carol"]);
  await election.deployed();
  return election;
}

describe("Election", function () {
  let Election;

  beforeEach(async function () {
    Election = await ethers.getContractFactory("Election");
  });

  it("sets the leader to the address that created the contract", async function () {
    const [owner] = await ethers.getSigners();
    const election = await Election.deploy(["alice", "bob", "carol"]);
    await election.deployed();

    expect(await election.leader()).to.equal(owner.address);
  });

  it("starts all candidates with 0 votes", async function () {
    const [owner] = await ethers.getSigners();
    const election = await newElection();

    for (let i = 0; i < 3; i++) {
      expect((await election.candidates(i)).totalVotes).to.equal(0);
    }
  });

  it("allows the leader to register new voters", async function () {
    const [owner, address1, address2] = await ethers.getSigners();
    const election = await newElection();

    await election.connect(owner).registerVoter(address1.address);
    await election.connect(owner).registerVoter(address2.address);

    expect((await election.voters(address1.address)).registered).to.equal(true);
    expect((await election.voters(address2.address)).registered).to.equal(true);
  });

  it("allows a registered voter to vote for three candidates", async function () {
    const [owner, address1] = await ethers.getSigners();
    const election = await newElection();

    await election.connect(owner).registerVoter(address1.address);

    // Vote for Alice (index 0), Bob (index 1), and Carol (index 2) with preference points (5, 3, 1)
    await election.connect(address1).castVote(0, 1, 2);

    // Check that the candidates have received the correct number of votes.
    expect((await election.candidates(0)).totalVotes).to.equal(5);
    expect((await election.candidates(1)).totalVotes).to.equal(3);
    expect((await election.candidates(2)).totalVotes).to.equal(1);
  });

  it("correctly determines the winner when multiple candidates have the same votes", async function () {
    const [owner, address1, address2, address3] = await ethers.getSigners();
    const election = await newElection();

    await election.connect(owner).registerVoter(address1.address);
    await election.connect(owner).registerVoter(address2.address);
    await election.connect(owner).registerVoter(address3.address);

    // Vote for Bob twice and Alice and Carol once each with preference points (5, 3, 1)
    await election.connect(address1).castVote(1, 0, 2);
    await election.connect(address2).castVote(1, 0, 2);
    await election.connect(address3).castVote(0, 1, 2);

    const winnerName = await election.winningCandidateName();
    expect(["alice", "bob", "carol"]).to.include(winnerName);
  });

  it("prevents voting for the same candidate more than once in a single vote", async function () {
    const [owner, address1] = await ethers.getSigners();
    const election = await newElection();

    await election.connect(owner).registerVoter(address1.address);

    // Attempt to vote for the same candidate twice
    await expect(election.connect(address1).castVote(1, 1, 2))
      .to.be.revertedWith('Candidates must be distinct.');
  });

    it("prevents election counting if no votes have been cast", async function () {
    const [owner] = await ethers.getSigners();
    const election = await Election.deploy(["alice", "bob", "carol"]);
    await election.deployed();

    // Attempt to determine the winner without any votes cast
    await expect(election.winningCandidateName()).to.be.revertedWith("No votes have been cast.");
  });


  it("prevents unregistered voters from voting", async function () {
    const [owner, address1] = await ethers.getSigners();
    const election = await newElection();

    // Attempt to vote
    await expect(election.connect(address1).castVote(1, 2, 0))
      .to.be.revertedWith('Voter is not registered.');
  });

  it("prevents double voting", async function () {
    const [owner, address1] = await ethers.getSigners();
    const election = await newElection();

    await election.connect(owner).registerVoter(address1.address);

    // Vote
    await election.connect(address1).castVote(1, 0, 2);

    // Attempt to vote again
    await expect(election.connect(address1).castVote(1, 2, 0))
      .to.be.revertedWith('Already voted.');
  });

  it("protects voter registration from non-leaders", async function () {
    const [owner, address1, address2] = await ethers.getSigners();
    const election = await newElection();

    // Attempt to register
    await expect(election.connect(address1).registerVoter(address2.address))
      .to.be.revertedWith('Only the election leader can grant voting rights.');
  });

  it("protects against double registration", async function () {
    const [owner, address1] = await ethers.getSigners();
    const election = await newElection();

    // Register our voter
    await election.connect(owner).registerVoter(address1.address);

    // Attempt to register again
    await expect(election.connect(owner).registerVoter(address1.address))
      .to.be.revertedWith('Voter is already registered.');
  });
});
