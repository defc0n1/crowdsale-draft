var OdysseyToken = artifacts.require("OdysseyToken");
var OdysseyPresale = artifacts.require("OdysseyPresale");
var Splitter = artifacts.require("./Splitter.sol");

module.exports = function(deployer) {
  deployer.deploy(OdysseyToken);
  deployer.deploy(OdysseyPresale);
  deployer.deploy(Splitter);
};
