[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/ik4aWSw_)
# Decentralized Ticket Sale

## Problem Statement
Implement a smart contract for selling tickets to events.

- The creator of the contract is the owner.
- The owner specifies the number and price of the tickets.
- People can buy tickets directly from the contract.
- Anyone can validate whether a given address owns a ticket.
- One person can only buy one ticket.
- People can sell their tickets through the contract. For this, they need to submit an offer stating the price they're willing to sell for. This price must be within +-20% of the original price (i.e. at least 80%, but at most 120%). Then, when someone accepts the offer, they pay the required amount, which is forwarded to the seller, and the buyer gets the ticket.
- There can only be one offer running at a time.
- The owner can withdraw any profits.

## Contract Interface
- constructor: `constructor TicketSale(uint16 numTickets, uint256 basePrice)`
    - Creates a ticket sale with `numTickets` tickets, sold for `basePrice`.
    - The sender of the transaction (`msg.sender`) is the owner.
- validate: `function validate(address person) view returns (bool)`
    - Returns true if person has a ticket, false otherwise.
- buy ticket: `function buyTicket() payable`
    - The sender of the transaction (`msg.sender`) buys one ticket for the base price.
    - Succeeds only if there are tickets left, the sender has not bought a ticket yet, and he/she sends the correct amount of ether.
    - New tickets are assigned a unique identifier (uint16).
    - ticketID(s) are to given in incremental order starting from 1 to `numTickets`.
- get ticket id: `function getTicketOf(address person) view returns (uint16)`
    - Returns the ticket id associated with the address `person`.
    - Should succeed only if person has a ticket.
- submit offer: `function submitOffer(uint16 ticketId, uint256 price)`
    - The sender of the transaction (`msg.sender`) submits an offer for selling their ticket (`ticketId`) for `price` wei.
    - The sender must own `ticketId`.
    - The proposed price must be in the 80-120% range of the original price.
    - The sender should not be able to submit an offer if there is already an offer going on.
- accept offer: `function acceptOffer(uint16 ticketId) payable`
    - The sender of the transaction (the buyer) accepts the sale offer for the ticket ticketId.
    - The buyer must send the correct amount of ether, which is transferred to the seller.
    - The buyer should not already have a ticket.
    - After the transaction, ticketId belongs to the buyer, and the offer is destroyed.
- withdraw: `function withdraw()`
    - Withdraw any funds on the contract.
    - Only the owner can call this method.

**NOTE** : Your code should contain atleast one modifier function.

You are free to add extra useful methods/attributes in the contract.

Implement the `TicketSale.sol` contract present in the `contracts/` folder. Function declarations are already provided. Do not edit them. 

Go through `TicketSaleTest.js` file in the `test/` folder to view what is expected and what error messages are to be reverted under the given condition. Do not edit the file.

Use `npx hardhat test` to run the tests.

## Bonus Assignment

Modify the contract such that it supports offers by multiple people at a time.

Create `TicketSale2.sol` file in the `contracts/` folder.

Write tests on your own for this contract in the `TicketSaleTest2.js` file in the `test/` folder.

You might need to take some help from some tutorials:
- [Hardhat tutorial for beginners](https://hardhat.org/tutorial) 
- [Testing contracts tutorial](https://hardhat.org/tutorial/testing-contracts)
- [Testing contracts guide](https://hardhat.org/hardhat-runner/docs/guides/test-contracts)

Use `npx hardhat coverage` to measure the test coverage.
