// Specifically request an abstraction for OdysseyPresaleToken
var OdysseyPresaleToken = artifacts.require('OdysseyPresaleToken');

contract('OdysseyPresaleToken', function(accounts) {

  it('should owner be default owner.', function() {
    return OdysseyPresaleToken.deployed().then(function(instance) {
      return instance.owner.call();
    }).then(function(owner) {
      assert.equal(
        owner.valueOf(),
        '0x627306090abab3a6e1400e9345bc60c78a8bef57',
        'Owner address does not match default address.',
      );
    });
  });

  // FIXME: Not sure why this one is failing.
  // Transfering ownership seens to work fine via the UI.
  it('should change owner to 0xF557962b6D1A0Be0c71B3b5289fE22441feCE4eA.', function() {
    var newOwner = '0xF557962b6D1A0Be0c71B3b5289fE22441feCE4eA';
    var contract;
    return OdysseyPresaleToken.deployed().then(function(instance) {
      contract = instance;
      return contract.transferOwnership.call(newOwner); // Transfer ownership.
    }).then(function() {
      return contract.owner.call(); // Get current owner.
    }).then(function(owner) {
      assert.equal(owner.valueOf(), newOwner, 'Owner was not updated.');
    });
  });
  
  it('should owner\'s initial token balance be equal to initial supply.', function() {
    var ownerBalance;
    var contract;
    return OdysseyPresaleToken.deployed().then(function(instance) {
      contract = instance;
      return contract.balanceOf.call(accounts[0]);
    }).then(function(balance) {
      ownerBalance = balance;
      return contract.initialSupply.call();
    }).then(function(initialSupply) {
      assert.equal(
        ownerBalance.valueOf(),
        initialSupply.valueOf(),
        'Owner address does not match default address.',
      );
    });
  });

  it('should transfer 1000 tokens to address, decrementing owner\'s balance.', function() {
    var numberOfTokens = 1000;
    var ownerBalanceInitial;
    var recipientAddress = '0xF557962b6D1A0Be0c71B3b5289fE22441feCE4eA';
    var contract;

    return OdysseyPresaleToken.deployed().then(function(instance) {
      contract = instance;
      return contract.balanceOf.call(accounts[0]);
    }).then(function(initialBalance) {
      ownerBalanceInitial = initialBalance;
      return contract.transfer(recipientAddress, numberOfTokens);
    }).then(function() {
      return contract.balanceOf.call(accounts[0]);
    }).then(function(finalBalance) {
      ownerBalanceFinal = finalBalance;
      assert.equal(
        ownerBalanceInitial.valueOf() - numberOfTokens,
        ownerBalanceFinal.valueOf(),
        'Owner balance was not decremented properly.',
      );
    });
  });

  it('should transfer 1000 tokens to address, incrementing receiver\'s balance.', function() {
    var numberOfTokens = 1000;
    var recipientBalanceInitial;
    var recipientAddress = '0xF557962b6D1A0Be0c71B3b5289fE22441feCE4eA';
    var contract;

    return OdysseyPresaleToken.deployed().then(function(instance) {
      contract = instance;
      return contract.balanceOf.call(recipientAddress);
    }).then(function(initialBalance) {
      recipientBalanceInitial = initialBalance.c[0];
      return contract.transfer(recipientAddress, numberOfTokens);
    }).then(function() {
      return contract.balanceOf.call(recipientAddress);
    }).then(function(finalBalance) {
      recipientBalanceFinal = finalBalance.c[0];
      assert.equal(
        recipientBalanceFinal.valueOf(),
        recipientBalanceInitial + numberOfTokens,
        'Recipient balance was not incremented properly.',
      );
    });
  });

});
