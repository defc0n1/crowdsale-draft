const OdysseyTokenMock = artifacts.require('OdysseyToken');
const BigNumber = web3.BigNumber;

/*
* @dev Test initial constants/constructor.
* @dev Tests that all initial properties are set correctly.
* @dev These might not be too useful, but they do provide a sanity check.
* @dev If tests are failing, it's likely that the initial properties changed.
*/
contract('OdysseyTokenMock', function(accounts) {

  /*
  * @dev Test initial constants/constructor.
  * @dev Tests that all initial properties are set correctly.
  * @dev These might not be too useful, but they do provide a sanity check.
  * @dev If tests are failing, it's likely that the initial properties changed.
  */
  describe('Constants & Constructor', function() {
    let contract;

    // Properties/constructor args.
    const NAME = 'OdysseyToken';
    const SYMBOL = 'ODT';
    const DECIMALS = 18;
    const INITIAL_SUPPLY = 12000000;

    // Custom (non-ERC20) properties.
    const IS_TRANSFER_ENABLED = true;

    before('deploy new OdysseyTokenMock', async () => {
        contract = await OdysseyTokenMock.deployed();
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

    it('should ensure isTransferEnabled is correct', async function(){
      let isTransferEnabled = await contract.isTransferEnabled();
      assert.equal(
        isTransferEnabled, IS_TRANSFER_ENABLED, 'Incorrect isTransferEnabled.'
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

    before('deploy new OdysseyTokenMock', async () => {
        contract = await OdysseyTokenMock.deployed();
    });

    it('should put 12,000,000 tokens in the first account', async function() {
      let numberOfTokens = 12000000;
      let balance = await contract.balanceOf(accounts[0]);
      assert.equal(balance.valueOf(), numberOfTokens, '12,000,000 wasn\'t in the first account.')
    });

    it('should transfer 4,000 tokens to an arbitrary account', async function() {
      let numberOfTokens = new BigNumber('4000');
      let recipient = '0xB03e2995D8a57D5558262BE381733E708202acdD';
      await contract.transfer(recipient, numberOfTokens, {from: accounts[0], gas: 250000});
      let recipientBalance = await contract.balanceOf.call(recipient);
      assert.equal(recipientBalance.valueOf(), numberOfTokens, 'Recipient balance not updated after token transfer.');
    });

    it('should not transfer more tokens than has in balance', async function() {
      let recipient = '0x277bf2c0E950A4B2d30867dc61F9C07AA81AC808';
      let balance = await contract.balanceOf(accounts[0]);
      let numberOfTokens = balance.valueOf() + 1;

      try {
        let transaction = await contract.transfer(
          recipient, numberOfTokens, {from: accounts[0], gas: 250000}
        );
      } catch(error) {
        reverted = true;
      }
      assert.isTrue(reverted, 'Sender sent more tokens than they had.');
    });

    it('should mint 9,000 tokens and transfer them to an arbitrary address', async function(){

      let numberOfTokens = new BigNumber('9000');
      let desiredOwner = '0xbe0139a56d89633995e4107d29e84973f3ef815f';

      let initialSupply = await contract.initialSupply();
      await contract.mint(
        desiredOwner, numberOfTokens, {from: accounts[0], gas: 250000}
      );
      let balance = await contract.balanceOf(desiredOwner);
      let totalSupply = await contract.totalSupply();

      assert.equal(
        balance.valueOf(),
        numberOfTokens,
        'Recipient balance was not updated with newly minted tokens.'
      );
      assert.equal(
        totalSupply.value,
        initialSupply.add(numberOfTokens).value,
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

    it('should prevent token transfers when transfers are disabled', async function(){
      let recipient = '0x950E573130697bb013D4ecA2d01a718a0286B322';
      let numberOfTokens = 1613;
      let reverted;
      let canTransfer = await contract.isTransferEnabled();
      // Ensure transfers are disabled.
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

    it('should burn 2,000 tokens, decrementing the total supply.', async function() {
      let numberOfTokens = new BigNumber('2000');
      let totalSupply = await contract.totalSupply();
      await contract.burn(numberOfTokens, {from: accounts[0]});
      let newTotalSupply = await contract.totalSupply();
      assert.equal(
        totalSupply.sub(numberOfTokens).value,
        newTotalSupply.value,
        'Total supply not decremented after burning tokens.'
      );
    });

    it('should burn 3,000 tokens, decrementing the sender\'s balance.', async function() {
      let numberOfTokens = new BigNumber('3000');
      let sender = accounts[0];
      let senderBalance = await contract.balanceOf(sender);
      await contract.burn(numberOfTokens, {from: sender});
      let newSenderBalance = await contract.balanceOf(sender);
      assert.equal(
        senderBalance.sub(numberOfTokens).value,
        newSenderBalance.value,
        'Sender balance not decremented after burning tokens.'
      );
    });
  });

  describe('Dangerous Functionality', function() {
    let contract;

    before('deploy new OdysseyTokenMock', async () => {
        contract = await OdysseyTokenMock.deployed();
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
