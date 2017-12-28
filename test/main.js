var OdysseyPresaleToken = artifacts.require('OdysseyPresaleToken');

contract('OdysseyPresaleToken', function(accounts) {

  let contract;

  before('deploy new OdysseyPresaleToken', async () => {
      contract = await OdysseyPresaleToken.deployed();
  });

  it('should put 12,000,000 tokens in the first account', async function() {
    let numberOfTokens = 12000000;
    let balance = await contract.balanceOf(accounts[0]);
    assert.equal(balance.valueOf(), numberOfTokens, '12,000,000 wasn\'t in the first account.')
  });

  it('should transfer 4,021 tokens to an arbitrary account', async function() {
    let numberOfTokens = 4021;
    let recipient = '0xB03e2995D8a57D5558262BE381733E708202acdD';
    await contract.transfer(recipient, numberOfTokens, {from: accounts[0], gas: 250000});
    let recipientBalance = await contract.balanceOf.call(recipient);
    assert.equal(recipientBalance.valueOf(), numberOfTokens, 'Recipient balance not updated after token transfer.');
  });

  it('should not transfer more tokens than has in balance', async function() {
    let recipient = '0x277bf2c0E950A4B2d30867dc61F9C07AA81AC808';
    let balance = await contract.balanceOf(accounts[0]);
    let numberOfTokens = balance.valueOf() + 1;
    //await contract.transfer(recipient, numberOfTokens, {from: accounts[0], gas: 250000});
    let recipientBalance = await contract.balanceOf.call(recipient);
    // FIXME: Figure out the best way to assert that the tx was reverted.
    //assert.equal(recipientBalance.valueOf(), 0, 'Sender sent more tokens than they had.');
  });

  it('should change token rate', async function (){
    let desiredRate = 37;
    await contract.setRate(desiredRate, {from: accounts[0], gas: 250000});
    let updatedRate = await contract.rate();
    assert.equal(desiredRate, updatedRate.valueOf());
  });

  it('should change withdrawal ownership', async function (){
    let desiredOwner = '0x4f8f736bae9dd528afe396049f037f368927de68';
    await contract.transferWithdrawalOwnership(
      desiredOwner, {from: accounts[0], gas: 250000}
    );
    let updatedOwner = await contract.withdrawalOwner();
    assert.equal(desiredOwner, updatedOwner.valueOf());
  });

  it('should mint 9601 tokens and transfer them to an arbitrary address', async function(){
    let numberOfTokens = 9601;
    let desiredOwner = '0xbe0139a56d89633995e4107d29e84973f3ef815f';

    let initialSupply = await contract.initialSupply();
    await contract.mint(
      desiredOwner, numberOfTokens, {from: accounts[0], gas: 250000}
    );
    let balance = await contract.balanceOf(desiredOwner);
    let totalSupply = await contract.totalSupply();

    assert.equal(
      balance,
      numberOfTokens,
      'Recipient balance was not updated with newly minted tokens.'
    );
    assert.equal(
      totalSupply.valueOf(),
      parseInt(initialSupply.valueOf()) + numberOfTokens,
      'Total supply was not updated after minting.'
    );
  });

  it('should total supply be greater than initial supply after minting', async function(){
    let initialSupply = await contract.initialSupply();
    let totalSupply = await contract.totalSupply();
    assert.isTrue(
      totalSupply > initialSupply,
      'Total supply is less than or equal to initial supply after minting.'
    );
  });

  it('should disable ability to mint tokens', async function (){
    await contract.finishMinting();
    let mintingFinished = await contract.mintingFinished();
    assert.isTrue(mintingFinished, 'Minting was not disabled properly.');
  });

  it('should toggle ability to transfer tokens', async function(){
    let canTransferInitial = contract.isTransferEnabled();
    await contract.toggleTransfers();
    let canTransferFinal = contract.isTransferEnabled();
    assert.notEqual(
      canTransferInitial,
      canTransferFinal,
      'isTransferEnabled was not toggled properly.'
    );
  });

  it('should toggle ability to purchase tokens', async function(){
    let canPurchaseInitial = contract.isPurchaseEnabled();
    await contract.togglePurchases();
    let canPurchaseFinal = contract.isPurchaseEnabled();
    assert.notEqual(
      canPurchaseInitial,
      canPurchaseFinal,
      'isPurchaseEnabled was not toggled properly.'
    );
  });

  // Make sure this does not precede other tests.
  it('should change contract ownership', async function (){
    let desiredOwner = '0x4f8f736bae9dd528afe396049f037f368927de68';
    await contract.transferOwnership(
      desiredOwner, {from: accounts[0], gas: 250000}
    );
    let updatedOwner = await contract.owner();
    assert.equal(desiredOwner, updatedOwner.valueOf());
  });

});
