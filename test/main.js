var OdysseyPresaleToken = artifacts.require('OdysseyPresaleToken');

contract('OdysseyPresaleToken', function(accounts) {

  let contract;

  before("deploy new OdysseyPresaleToken", async () => {
      contract = await OdysseyPresaleToken.deployed();
  });

  it("should put 12,000,000 tokens in the first account", async function() {
    let numberOfTokens = 12000000;
    let balance = await contract.balanceOf(accounts[0]);
    assert.equal(balance.valueOf(), numberOfTokens, "12,000,000 wasn't in the first account.")
  });

  it("should transfer 3,000 tokens to an arbitrary account", async function() {
    let numberOfTokens = 3000;
    let recipient = '0xB03e2995D8a57D5558262BE381733E708202acdD';
    let result = await contract.transfer(recipient, numberOfTokens, {from: accounts[0], gas: 250000});
    let recipientBalance = await contract.balanceOf.call(recipient);
    assert.equal(recipientBalance.valueOf(), numberOfTokens, "Recipient balance not updated after token transfer.");
  });

})
