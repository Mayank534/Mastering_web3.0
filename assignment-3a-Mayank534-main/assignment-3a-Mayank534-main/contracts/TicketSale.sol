// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


contract TicketSale {
    uint16 public numTickets;
    uint16 public currentticket=0;
    uint256 public basePrice;
    address public owner;
    struct Offer {
        address offerer;
        uint256 price;
        uint16 id;
    }
    Offer public offer;
    
    mapping(address => uint16 ) public ticketOwners;
    mapping(uint16 => Offer) public ticketOffers;
    constructor(uint16 _numTickets, uint256 _basePrice){
        // TODO
        numTickets = _numTickets;
        basePrice = _basePrice;
        owner = msg.sender;
    }

    function validate(address person) public view returns (bool) {
        // TODO
        return (ticketOwners[person] != 0);
    }

    function buyTicket() public payable {
        // TODO
        require(ticketOwners[msg.sender] == 0, "You already have a ticket!");
        require((numTickets>currentticket) , "No Tickets left!");
        require(msg.value >= basePrice, "Pay equal to the base price!");
        ticketOwners[msg.sender]=++currentticket;
       
    }

    function getTicketOf(address person) public view returns (uint16) {
        // TODO
        require(ticketOwners[person]==1,"The person does not have any ticket");
        return ticketOwners[person];
    }

    function submitOffer(uint16 ticketId, uint256 price) public {
        // TODO
        require(ticketOwners[msg.sender] > 0, "You do not own any ticket!");
        require(ticketOwners[msg.sender]==ticketId, "Wrong ticket Id!");
        require(price >= basePrice*80/100, "Offer too Low!");
        require(price <= basePrice*120/100, "Offer too High!");
        require(ticketOffers[ticketId].offerer == address(0), "There is already an offer running!");
        require(checkExistingOffers() == false, "There is already an offer running!");

        ticketOffers[ticketId] = Offer(msg.sender, price, ticketId);
        offer.offerer=msg.sender;
        offer.price=price;
        offer.id=ticketId;
        
    }
    function checkExistingOffers() private view returns (bool) {
        for (uint16 i = 1; i <= numTickets; i++) {
            if (ticketOffers[i].offerer != address(0)) {
                return true;
            }
        }
        return false;
    }

    function acceptOffer(uint16 ticketId) public payable {
        // TODO
        uint16 no=1;
        for(uint16 i=1;i<numTickets;i++){
            if (ticketOffers[i].id == 0){
                no=0;

            }
        }
        require(ticketOwners[msg.sender]==0,"You already have a ticket!");
        require(no!=0, "No offers available!");
        require(ticketOffers[ticketId].id > 0, "The ticket is not under offer!");
        
        //require(msg.sender == owner, "Only the owner can accept an offer.");
        require(msg.value == ticketOffers[ticketId].price, "Pay the valid price offered!");

        address previousOwner = ticketOffers[ticketId].offerer;
        ticketOwners[previousOwner] = 0;
        ticketOwners[msg.sender] = ticketId;
        delete ticketOffers[ticketId];

    }
    
    function withdraw() public {
        // TODO
        require(msg.sender == owner, "Only owner can withdraw!");
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);
    }
}
