App = {
  web3Provider: null,
  primaryAccount: null,
  tokenInstance: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    // Initialize web3 and set the provider to the testRPC.
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    } else {
      // set the provider you want from Web3.providers
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:9545');
      web3 = new Web3(App.web3Provider);
    }
    return App.initAccount();
  },

  initAccount: function() {
    // Initialize web3 account via metamask.
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }
      App.primaryAccount = accounts[0];
      // Get wallet info.
      App.getEthAddress();
      App.getEthBalance();
    });
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('OdysseyPresaleToken.json', function(data) {

      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var OdysseyPresaleTokenArtifact = data;
      App.contracts.OdysseyPresaleToken = TruffleContract(OdysseyPresaleTokenArtifact);

      // Set the provider for our contract.
      App.contracts.OdysseyPresaleToken.setProvider(App.web3Provider);

      // Get the contract instance.
      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        App.tokenInstance = instance;
      }).then(function() {
        console.log(App.tokenInstance);
        // Get contract info.
        App.getContractAddress();
        App.getContractDecimals();
        App.getTokenName();
        App.getInitialSupply();
        App.getOdtBalance(App.primaryAccount);
        App.getContractOwner();
        App.getWithdrawalOwner();
        App.getTotalSupply();
        App.getTokenRate();
        App.getIsMintingFinished();
        App.getIsTransferEnabled();
        App.getIsPurchaseEnabled();
      });
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '#purchaseButton', App.handlePurchase);
    $(document).on('click', '#transferButton', App.handleTransfer);
    $(document).on('click', '#balanceButton', App.handleGetBalance);
    $(document).on('click', '#setRateButton', App.handleSetRate);
    $(document).on('click', '#mintButton', App.handleMint);
    $(document).on('click', '#toggleTransfersButton', App.handleToggleTransfers);
    $(document).on('click', '#togglePurchasesButton', App.handleTogglePurchases);
    $(document).on('click', '#disableMintingButton', App.handleDisableMinting);
    $(document).on('click', '#selfDestructButton', App.handleSelfDestruct);
    $(document).on('click', '#transferOwnershipButton', App.handleTransferOwnership);
    $(document).on('click', '#transferWithdrawalOwnershipButton', App.handleTransferWithdrawalOwnership);
  },

  // Wallet functions. --------------------------------------------------------

  getEthAddress: function() {
    var address = App.primaryAccount;
    $('#ETHAddress').text(address);
  },

  getEthBalance: function() {
    web3.eth.getBalance(
      App.primaryAccount, function(error, balance) {
        balance = web3.fromWei(balance);
        $('#ETHBalance').text(balance);
    });
  },

  // Contract getters. --------------------------------------------------------

  getContractAddress: function(adopters, account) {
    var address = App.tokenInstance.address;
    $('#ODTContractAddress').text(address);
  },

  getContractDecimals: function() {
    App.tokenInstance.decimals().then(function(result) {
      decimals = result.c[0];
      $('#ODTDecimals').text(decimals);
    });
  },

  getTokenName: function() {
    App.tokenInstance.name().then(function(result) {
      $('#ODTTokenName').text(result);
    });
  },

  getInitialSupply: function() {
    App.tokenInstance.initialSupply().then(function(result) {
      initialSupply = result;
      initialSupply = formatter.format(initialSupply);
      $('#ODTInitialSupply').text(initialSupply);
    });
  },

  getOdtBalance: function(account) {
    App.tokenInstance.balanceOf(account).then(function(result) {
      balance = result.c[0];
      balance = formatter.format(balance);
      $('#ODTBalance').text(balance);
    });
  },

  getContractOwner: function() {
    App.tokenInstance.owner().then(function(result) {;
      $('#ODTContractOwner').text(result);
    });
  },

  getWithdrawalOwner: function() {
    App.tokenInstance.withdrawalOwner().then(function(result) {
      $('#ODTWithdrawalOwner').text(result);
    });
  },

  getTotalSupply: function() {
    App.tokenInstance.totalSupply().then(function(result) {
      totalSupply = result;
      totalSupply = formatter.format(totalSupply);
      $('#ODTTotalSupply').text(totalSupply);
    });
  },

  getTokenRate: function() {
    App.tokenInstance.rate().then(function(result) {
      $('#ODTTokenRate').text(result);
    });
  },

  getIsMintingFinished: function() {
    App.tokenInstance.mintingFinished().then(function(result) {
      // Negate the bool. We just care if we can mint new tokens.
      let canMintTokens = (!result).toString().capitalize();
      $('#ODTCanMintTokens').text(canMintTokens);
    });
  },

  getIsTransferEnabled: function() {
    App.tokenInstance.isTransferEnabled().then(function(result) {
      isTransferEnabled = result;
      let canTransferTokens = (isTransferEnabled).toString().capitalize();
      $('#ODTCanTransferTokens').text(canTransferTokens);
    });
  },

  getIsPurchaseEnabled: function() {
    App.tokenInstance.isPurchaseEnabled().then(function(result) {
      isPurchaseEnabled = result;
      let canPurchaseTokens = (isPurchaseEnabled).toString().capitalize();
      $('#ODTCanPurchaseTokens').text(canPurchaseTokens);
    });
  },

  // Contract utility functions. ----------------------------------------------

  handlePurchase: function(event) {

    event.preventDefault();
    var toAddress = $('#ODTPurchaseAddress').val();
    var amountEth = $('#ETHPurchaseAmount').val();

    App.tokenInstance.purchase(
      toAddress, {from: App.primaryAccount, value:web3.toWei(amountEth,"ether")}
    ).then(function(result) {
      alert('Purchase Successful!');
    });
  },

  handleTransfer: function(event) {

    event.preventDefault();
    var amount = parseInt($('#ODTTransferAmount').val());
    var toAddress = $('#ODTTransferAddress').val();

    // Validate inputs or throw error.
    if(isNaN(amount) || amount <= 0){
      alert('Invalid Amount.');
      return;
    }

    App.tokenInstance.transfer(
      toAddress, amount, {from: App.primaryAccount}
    ).then(function(result) {
      alert('Transfer Successful!');
    });
  },

  handleGetBalance: function(event) {

    event.preventDefault();
    var balanceAddress = $('#ODTBalanceAddress').val();

    App.tokenInstance.balanceOf(balanceAddress).then(function(result) {
      balance = result;
      balance = formatter.format(balance);
      alert('Got balance:' + balanceAddress + ' - ' + balance + ' ODT');
    });
  },

  handleSetRate: function(event) {

    event.preventDefault();
    var rate = parseInt($('#ODTConversionRate').val());

    App.tokenInstance.setRate(
      rate, {from: App.primaryAccount}
    ).then(function(result) {
      alert('Changed rate successfully!');
    });
  },

  handleMint: function(event) {

    event.preventDefault();
    var amount = parseInt($('#ODTMintAmount').val());
    var toAddress = $('#ODTMintAddress').val();

    // Validate inputs or throw error.
    if(isNaN(amount) || amount <= 0){
      alert('Invalid Amount.');
      return;
    }

    App.tokenInstance.mint(
      toAddress, amount, {from: App.primaryAccount}
    ).then(function(result) {
      alert('Mint Successful!');
      // TODO: Refresh token values?
    });
  },

  handleDisableMinting: function(event) {

    event.preventDefault();
    let result = confirm("Are you sure you want to disable minting?");
    if(!result){
      return;
    }

    App.tokenInstance.finishMinting(
      {from: App.primaryAccount}
    ).then(function(result) {
      alert('Minting disabled successfully!');
      // TODO: Refresh token values?
    });
  },

  handleTogglePurchases: function(event) {

    event.preventDefault();
    let result = confirm("Are you sure you want to enable/disable token purchases?");
    if(!result){
      return;
    }

    App.tokenInstance.togglePurchases(
      {from: App.primaryAccount}
    ).then(function(result) {
      alert('Enabled/disabled token purchases successfully!');
      // TODO: Refresh token values?
    });
  },

  handleToggleTransfers: function(event) {

    event.preventDefault();
    let result = confirm("Are you sure you want to enable/disable token transfers?");
    if(!result){
      return;
    }

    App.tokenInstance.toggleTransfers(
      {from: App.primaryAccount}
    ).then(function(result) {
      alert('Enabled/disabled token transfers successfully!');
      // TODO: Refresh token values?
    });
  },

  handleSelfDestruct: function(event) {
    event.preventDefault();

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      let result = confirm("Are you sure you want to self-destruct?");
      if(!result){
        return;
      }

      var account = accounts[0];
      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;
        return odysseyPresaleToken.selfDestruct({from: account});
      }).then(function(result) {
        alert('The contract is dead! All hail the contract!');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleTransferOwnership: function(event) {

    event.preventDefault();
    var newOwner = $('#ODTNewOwnerAddress').val();

    let result = confirm(
      "Are you sure you want to transfer ownership to " + newOwner + "?"
    );
    if(!result){
      return;
    }

    App.tokenInstance.transferOwnership(
      newOwner, {from: App.primaryAccount}
    ).then(function(result) {
      alert('Contract ownership has been transferred!');
    });
  },

  handleTransferWithdrawalOwnership: function(event) {

    event.preventDefault();
    var newWithdrawalOwner = $('#ODTNewWithdrawalOwnerAddress').val();

    let result = confirm(
      "Are you sure you want to transfer withdrawal ownership to " + newWithdrawalOwner + "?"
    );
    if(!result){
      return;
    }

    App.tokenInstance.transferWithdrawalOwnership(
      newWithdrawalOwner, {from: App.primaryAccount}
    ).then(function(result) {
      alert('Withdrawal ownership has been transferred!');
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

// Event listeners. -----------------------------------------------------------

var element = document.getElementById('ETHPurchaseAmount');
element.addEventListener('input', function (e) {
  convertEthToOdt();
}, false);

var element = document.getElementById('ODTPurchaseAmount');
element.addEventListener('input', function (e) {
  convertOdtToEth();
}, false);

// Helper functions. ----------------------------------------------------------

function convertEthToOdt(){
  var amountEth = parseFloat($('#ETHPurchaseAmount').val());
  var tokenRate = parseFloat($('#ODTTokenRate').text());
  var amountOdt = amountEth * tokenRate;

  var element = document.getElementById('ODTPurchaseAmount');
  if(isNaN(amountOdt)){
    element.value = '';
  } else {
    element.value = amountOdt;
  }
}

function convertOdtToEth(){
  var amountOdt = parseFloat($('#ODTPurchaseAmount').val());
  var tokenRate = parseFloat($('#ODTTokenRate').text());
  var amountEth = amountOdt / tokenRate;

  var element = document.getElementById('ETHPurchaseAmount');
  if(isNaN(amountEth)){
    element.value = '';
  } else {
    element.value = amountEth;
  }
}

// Format token values.
var formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

// Allow strings to be capitalized.
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
