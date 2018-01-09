var OdysseyToken = artifacts.require('./OdysseyToken.sol');
var OdysseyPresale = artifacts.require('./OdysseyPresale.sol');
var MultipleOwners = artifacts.require('./MultipleOwners.sol');
var Splitter = artifacts.require('./Splitter.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Splitter);
  deployer.deploy(MultipleOwners);

  /* Token parameters. */
  let _name = 'OdysseyToken';
  let _symbol = 'ODT';
  let _decimals = 18;
  let _initialSupply = 12000000;
  let _isTransferEnabled = true;

  /* Crowdsale parameters. */
  let _wallet = accounts[1];
  let _isPurchaseEnabled = true;
  let _rate = 3;
  let _cap = 90000;

  /* Deploy OdysseyToken. */
  deployer.deploy(
    OdysseyToken,
    _name,
    _symbol,
    _decimals,
    _initialSupply,
    _isTransferEnabled,
    {gas: 3000000}
  );

  /* Deploy OdysseyPresale. */
  deployer.deploy(
    OdysseyPresale,
    _wallet,
    _isPurchaseEnabled,
    _rate,
    _cap,
    {gas: 3000000}
  );
};
