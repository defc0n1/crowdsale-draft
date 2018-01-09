const OdysseyTokenMock = artifacts.require('OdysseyToken');
const OdysseyPresaleMock = artifacts.require('OdysseyPresale');
const BigNumber = web3.BigNumber;

/*
* @dev Test initial constants/constructor.
* @dev Tests that all initial properties are set correctly.
* @dev These might not be too useful, but they do provide a sanity check.
* @dev If tests are failing, it's likely that the initial properties changed.
*/
contract('OdysseyPresaleMock', function(accounts) {

  /*
  * @dev Test initial constants/constructor.
  * @dev Tests that all initial properties are set correctly.
  * @dev These might not be too useful, but they do provide a sanity check.
  * @dev If tests are failing, it's likely that the initial properties changed.
  */
  describe('Constants & Constructor', function() {

    let token, crowdsale;

    // Properties/constructor args.
    const NAME = 'OdysseyPresaleMock';
    const SYMBOL = 'ODT';
    const DECIMALS = 18;
    const INITIAL_SUPPLY = 12000000;

    // Custom (non-ERC20) properties.
    const IS_TRANSFER_ENABLED = true;

    before('deploy new OdysseyPresaleMock', async () => {
        token = await OdysseyTokenMock.deployed();
        //console.log('Token Address: ', token.address);
        crowdsale = await OdysseyPresaleMock.deployed();
        //console.log('Crowdsale Address: ', crowdsale.address);

        tokenOwner = await token.owner();
        crowdsaleOwner = await crowdsale.owner();
        //console.log('Token Contract Owner: ', tokenOwner);
        //console.log('Crowdsale Contract Owner: ', crowdsaleOwner);
    });

    it('should recipient balance is incremented after purchase', async function(){
      //let sender = accounts[0];

      //let recipientBalance = await token.balanceOf(recipient);
      //let value = new web3.BigNumber(web3.toWei(0.5, 'ether'));
      //await crowdsale.buyTokens(recipient, {from: sender, value: value});
      //let newRecipientBalance = await token.balanceOf(recipient);
      //let newTotalSupply = await token.totalSupply();

      //console.log('Balance before: ' + recipientBalance);
      //console.log('Balance after: ' + newRecipientBalance);
      //console.log(newTotalSupply);

      let sender = accounts[0];
      let recipient = '0x267a156db93b5950198306845a64ce7dda6dcb81';
      let numberOfTokens = 2000;
      let totalSupply = await token.totalSupply();

      //await token.mint(
      //  recipient, numberOfTokens, {from: sender, gas: 250000}
      //);

      let value = new web3.BigNumber(web3.toWei(0.5, 'ether'));
      await crowdsale.buyTokens(recipient, {from: sender, value: value});

      let newTotalSupply = await token.totalSupply();

      console.log(totalSupply);
      console.log(newTotalSupply);

      assert.isTrue(false);
    });
  });
});
