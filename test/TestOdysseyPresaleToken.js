var OdysseyPresaleToken = artifacts.require('OdysseyPresaleToken');
//var assertRevert = require('zeppelin-solidity/test/helpers/assertRevert');

function assertJump(error) {
  assert.isAbove(error.message.search('invalid opcode'), -1, 'Invalid opcode error must be returned');
}

/*
* @dev Test initial constants/constructor.
* @dev Tests that all initial properties are set correctly.
* @dev These might not be too useful, but they do provide a sanity check.
* @dev If tests are failing, it's likely that the initial properties changed.
*/
contract('OdysseyPresaleToken', function(accounts) {

  /*
  * @dev Test initial constants/constructor.
  * @dev Tests that all initial properties are set correctly.
  * @dev These might not be too useful, but they do provide a sanity check.
  * @dev If tests are failing, it's likely that the initial properties changed.
  */
  describe('Constants & Constructor', function() {

    let contract;

    // Properties/constructor args.
    const NAME = 'OdysseyPresaleToken';
    const SYMBOL = 'ODT';
    const DECIMALS = 18;
    const INITIAL_SUPPLY = 12000000;

    // Custom (non-ERC20) properties.
    const RATE = 60;
    const IS_TRANSFER_ENABLED = true;
    const IS_PURCHASE_ENABLED = true;
    let _withdrawalOwner;

    before('deploy new OdysseyPresaleToken', async () => {
        contract = await OdysseyPresaleToken.deployed();
        _withdrawalOwner = await contract.owner()
    });

    it('should ensure name is correct', async function(){
      let name = await contract.name();
      assert.equal(name, NAME, 'Incorrect name.');
    });

    it('should ensure symbol is correct', async function(){
      let symbol = await contract.symbol();
      assert.equal(symbol, SYMBOL, 'Incorrect symbol.');
    });

    it('should ensure decimal amount is correct', async function(){
      let decimals = await contract.decimals();
      assert.equal(decimals, DECIMALS, 'Incorrect decimal amount.');
    });

    it('should ensure initial supply is correct', async function(){
      let initial_supply = await contract.initialSupply();
      assert.equal(
        initial_supply, INITIAL_SUPPLY, 'Incorrect initial supply.'
      );
    });

    it('should ensure rate is correct', async function(){
      let rate = await contract.rate();
      assert.equal(rate, RATE, 'Incorrect rate.');
    });

    it('should ensure isTransferEnabled is correct', async function(){
      let isTransferEnabled = await contract.isTransferEnabled();
      assert.equal(
        isTransferEnabled, IS_TRANSFER_ENABLED, 'Incorrect isTransferEnabled.'
      );
    });

    it('should ensure isPurchaseEnabled is correct', async function(){
      let isPurchaseEnabled = await contract.isPurchaseEnabled();
      assert.equal(
        isPurchaseEnabled, IS_PURCHASE_ENABLED, 'Incorrect isPurchaseEnabled.'
      );
    });

    it('should ensure withdrawalOwner is correct', async function(){
      let withdrawalOwner = await contract.withdrawalOwner();
      assert.equal(
        withdrawalOwner, _withdrawalOwner, 'Incorrect withdrawalOwner.'
      );
    });
  });

  /*
  * @dev Test common functionality.
  * @dev Try to avoid writing tests for zepplin contracts/dependencies
  * @dev unless the function has been modified, such as with transfer().
  */
  describe('Common Functionality', function() {
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

    it('should purchase 120 tokens and send them to a given address', async function (){
      let tokenRecipient = accounts[1];
      let owner = await contract.owner();
      let amount = web3.toWei(2.0, "ether");
      await contract.purchase(
        tokenRecipient, {from: owner, value: amount, gas: 250000}
      );
      tokenRecipientBalance = await contract.balanceOf(tokenRecipient);
      assert.equal(
        tokenRecipientBalance.valueOf(),
        120,
        'Incorrect recipient token balance after purchase.'
      );
    });

    it('should withdraw ether to withdrawal owner address', async function() {
      let owner = await contract.owner();
      let ownerBalance = await web3.eth.getBalance(owner);
      let contractBalance = await web3.eth.getBalance(contract.address);

      var tx = await contract.withdrawEther(contractBalance);
      var gasUsed = tx.receipt.gasUsed;
      tx = web3.eth.getTransaction(tx.tx);
      var gasPrice = tx.gasPrice.toNumber();
      var txCost = gasPrice * gasUsed;

      let updatedOwnerBalance = await web3.eth.getBalance(owner);

      assert.equal(
        parseInt(ownerBalance.valueOf()) + parseInt(contractBalance.valueOf()) - txCost,
        updatedOwnerBalance.valueOf(),
        'Failed to withdraw ether from contract.'
      );
    });

    it('should change token rate', async function (){
      let desiredRate = 37;
      await contract.setRate(desiredRate, {from: accounts[0], gas: 250000});
      let updatedRate = await contract.rate();
      assert.equal(desiredRate, updatedRate.valueOf());
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

    it('should prevent token transfers when transfers are disabled', async function(){
      let recipient = '0x950E573130697bb013D4ecA2d01a718a0286B322';
      let numberOfTokens = 1613;
      let reverted;
      let canTransfer = await contract.isTransferEnabled();
      // Make sure transfers are disabled.
      if(canTransfer){
        await contract.toggleTransfers();
      }

      try {
        let transaction = await contract.transfer(
          recipient, numberOfTokens, {from: accounts[0], gas: 250000}
        );
      } catch(error) {
        reverted = true;
      }
      assert.isTrue(reverted, 'Transfer did not revert when transfers are disabled.');
    });
  });

  describe('Dangerous Functionality', function() {
    before('deploy new OdysseyPresaleToken', async () => {
        contract = await OdysseyPresaleToken.deployed();
    });

    it('should change withdrawal owner', async function (){
      let desiredOwner = '0x4f8f736bae9dd528afe396049f037f368927de68';
      await contract.transferWithdrawalOwnership(
        desiredOwner, {from: accounts[0], gas: 250000}
      );
      let updatedOwner = await contract.withdrawalOwner();
      assert.equal(desiredOwner, updatedOwner.valueOf());
    });

    it('should change contract owner', async function (){
      let desiredOwner = '0x4f8f736bae9dd528afe396049f037f368927de68';
      await contract.transferOwnership(
        desiredOwner, {from: accounts[0], gas: 250000}
      );
      let updatedOwner = await contract.owner();
      assert.equal(desiredOwner, updatedOwner.valueOf());
    });
  });
});
