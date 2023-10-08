const { expect } = require("chai");

describe("TicketSale", function() {
  let ticketSale;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  beforeEach(async () => {
    const TicketSale = await ethers.getContractFactory("TicketSale");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    ticketSale = await TicketSale.deploy(2, 100);
    await ticketSale.deployed();
  });

  it("should initialize the contract correctly", async () => {
    const numTickets = await ticketSale.numTickets();
    const basePrice = await ticketSale.basePrice();
    const contractOwner = await ticketSale.owner();

    expect(numTickets).to.equal(2);
    expect(basePrice).to.equal(100);
    expect(contractOwner).to.equal(owner.address);
  });

  it("should allow a person to buy a ticket", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    const ticketId = await ticketSale.getTicketOf(addr1.address);
    expect(ticketId).to.equal(1);
  });

  it("should not allow a person to buy a ticket if they already have one", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await expect(ticketSale.connect(addr1).buyTicket({ value: 100 })).to.be.revertedWith("You already have a ticket!");
  });

  it("should revert when a person tries to buy a ticket with insufficient payment", async function() {
    await expect(ticketSale.connect(addr1).buyTicket({ value: 50 })).to.be.revertedWith("Pay equal to the base price!");
  });
  
  it("should validate for a person who owns a ticket", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    const isValid = await ticketSale.validate(addr1.address);
    expect(isValid).to.be.true;
  });
  
  it("should not validate for a person who does not own a ticket", async function() {
    const isValid = await ticketSale.validate(addr1.address);
    expect(isValid).to.be.false;
  });

  it("should not allow a person to buy a ticket if there are no tickets left", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr2).buyTicket({ value: 100 });
    await expect(ticketSale.connect(addr3).buyTicket({ value: 100 })).to.be.revertedWith("No Tickets left!");
  });

  it("should allow a person to submit an offer for their ticket if the offer price is within expected range", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 120);
    const offer = await ticketSale.offer();
    expect(offer.offerer).to.equal(addr1.address);
    expect(offer.price).to.equal(120);
    expect(offer.id).to.equal(1);
  });

  it("should not allow a person to submit an offer if they do not own any ticket", async function() {
    await expect(ticketSale.connect(addr1).submitOffer(1, 110)).to.be.revertedWith("You do not own any ticket!");
  });

  it("should not allow a person to submit an offer for a wrong ticket Id", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await expect(ticketSale.connect(addr1).submitOffer(2, 200)).to.be.revertedWith("Wrong ticket Id!");
  });

  it("should not allow a person to submit an offer with a price too high", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await expect(ticketSale.connect(addr1).submitOffer(1, 601)).to.be.revertedWith("Offer too High!");
  });

  it("should not allow a person to submit an offer with a price too low", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await expect(ticketSale.connect(addr1).submitOffer(1, 79)).to.be.revertedWith("Offer too Low!");
  });

  it("should allow the owner to accept an offer and transfer the ticket", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 90);
    await ticketSale.connect(owner).acceptOffer(1, { value: 90 });
    await expect(ticketSale.getTicketOf(addr1.address)).to.be.revertedWith("The person does not have any ticket");
    const ticketId2 = await ticketSale.getTicketOf(owner.address);
    expect(ticketId2).to.equal(1);
  });

  it("should not allow a person to accept an offer if they already have a ticket", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr2).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 120);
    await expect(ticketSale.connect(addr2).acceptOffer(1, { value: 120 })).to.be.revertedWith("You already have a ticket!");
  });

  it("should not allow a person to accept an offer if there are no offers available", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await expect(ticketSale.connect(owner).acceptOffer(1, { value: 200 })).to.be.revertedWith("No offers available!");
  });

  it("should not allow a person to accept an offer for a ticket that is not under offer", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1,110);
    await expect(ticketSale.connect(owner).acceptOffer(2, { value: 110 })).to.be.revertedWith("The ticket is not under offer!");
  });

  it("should not allow a person to accept an offer with an invalid price", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 100);
    await expect(ticketSale.connect(owner).acceptOffer(1, { value: 99 })).to.be.revertedWith("Pay the valid price offered!");
  });

  
  it("should revert when a person tries to submit an offer while his/her offer is already running", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 120);
    await expect(ticketSale.connect(addr1).submitOffer(1, 120)).to.be.revertedWith("There is already an offer running!");
  });

  it("should revert when a person tries to submit an offer while another offer by a different person is already running", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr2).buyTicket({ value: 100 });
    await ticketSale.connect(addr1).submitOffer(1, 120);
    await expect(ticketSale.connect(addr2).submitOffer(2, 80)).to.be.revertedWith("There is already an offer running!");
  });

  it("should allow the owner to withdraw the contract balance", async function() {
    await ticketSale.connect(addr1).buyTicket({ value: 100 });
    await ticketSale.connect(addr2).buyTicket({ value: 100 });
    await ticketSale.connect(owner).withdraw();
    const ownerBalance = await ethers.provider.getBalance(owner.address);
    expect(ownerBalance).to.be.above(0);
  });

  it("should not allow a non-owner to withdraw the contract balance", async function() {
    await expect(ticketSale.connect(addr1).withdraw()).to.be.revertedWith("Only owner can withdraw!");
  });
});


