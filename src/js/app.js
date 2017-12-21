App = {
  web3Provider: null,
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
    return App.initContract();
  },

  initContract: function() {
    $.getJSON('OdysseyPresaleToken.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract.
      var OdysseyPresaleTokenArtifact = data;
      App.contracts.OdysseyPresaleToken = TruffleContract(OdysseyPresaleTokenArtifact);

      // Set the provider for our contract.
      App.contracts.OdysseyPresaleToken.setProvider(App.web3Provider);

      // Get wallet and contract info.
      App.getDecimals();
      App.getTokenName();
      App.getInitialSupply();
      App.getTotalSupply();
      App.getTokenRate();
      App.getIsMintingFinished();
      App.getIsTransferEnabled();

      // Get the user's current ODT balance.
      App.getBalances();
      App.getEthAddress();
      App.getEthBalances();
      App.getContractAddress();
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
    $(document).on('click', '#disableMintingButton', App.handleDisableMinting);
    $(document).on('click', '#selfDestructButton', App.handleSelfDestruct);
  },

  getEthAddress: function() {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var address = accounts[0];
      $('#ETHAddress').text(address);
    });
  },

  getEthBalances: function() {
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      web3.eth.getBalance(
        accounts[0], function(error, balance) {
          balance = web3.fromWei(balance);
          $('#ETHBalance').text(balance);
      });


    });
  },

  getContractAddress: function(adopters, account) {

    var odysseyPresaleToken;
    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      return odysseyPresaleToken.address;
    }).then(function(result) {
      address = result;
      $('#ODTContractAddress').text(address);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getBalances: function(adopters, account) {

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;

        return odysseyPresaleToken.balanceOf(account);
      }).then(function(result) {
        balance = result.c[0];
        balance = formatter.format(balance);
        $('#ODTBalance').text(balance);
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  getDecimals: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let decimals = odysseyPresaleToken.decimals();
      return decimals;
    }).then(function(result) {
      decimals = result.c[0];
      $('#ODTDecimals').text(decimals);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getTokenName: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let name = odysseyPresaleToken.name();
      return name;
    }).then(function(result) {
      name = result;
      $('#ODTTokenName').text(name);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getInitialSupply: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let initialSupply = odysseyPresaleToken.INITIAL_SUPPLY();
      return initialSupply;
    }).then(function(result) {
      initialSupply = result;
      initialSupply = formatter.format(initialSupply);
      $('#ODTInitialSupply').text(initialSupply);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getTotalSupply: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let totalSupply = odysseyPresaleToken.totalSupply();
      return totalSupply;
    }).then(function(result) {
      totalSupply = result;
      totalSupply = formatter.format(totalSupply);
      $('#ODTTotalSupply').text(totalSupply);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getTokenRate: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let rate = odysseyPresaleToken.rate();
      return rate;
    }).then(function(result) {
      rate = result;
      rate = formatter.format(rate);
      $('#ODTTokenRate').text(rate);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getIsMintingFinished: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let isMiningFinished = odysseyPresaleToken.mintingFinished();
      return isMiningFinished;
    }).then(function(result) {
      isMiningFinished = result;
      // Negate the bool. We just care if we can mint new tokens.
      let canMintTokens = (!isMiningFinished).toString().capitalize();
      $('#ODTCanMintTokens').text(canMintTokens);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  getIsTransferEnabled: function() {

    var odysseyPresaleToken;

    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      let isTransferEnabled = odysseyPresaleToken.isTransferEnabled();
      return isTransferEnabled;
    }).then(function(result) {
      isTransferEnabled = result;
      let canTransferTokens = (isTransferEnabled).toString().capitalize();
      $('#ODTCanTransferTokens').text(canTransferTokens);
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  handlePurchase: function(event) {
    event.preventDefault();

    var toAddress = $('#ODTPurchaseAddress').val();
    var amountEth = $('#ETHPurchaseAmount').val();

    console.log('Purchase ODT and send to ' + toAddress);

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;
        return odysseyPresaleToken.purchase(toAddress, {from: account, value:web3.toWei(amountEth,"ether")});
      }).then(function(result) {
        alert('Purchase Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
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

    console.log('Transfer ' + amount + ' ODT to ' + toAddress);

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;
        return odysseyPresaleToken.transfer(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Transfer Successful!');
        return App.getBalances();
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleGetBalance: function(event) {
    event.preventDefault();

    var balanceAddress = $('#ODTBalanceAddress').val();

    var odysseyPresaleToken;
    App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
      odysseyPresaleToken = instance;
      return odysseyPresaleToken.balanceOf(balanceAddress);
    }).then(function(result) {
      balance = result;
      balance = formatter.format(balance);
      alert('Got balance:' + balanceAddress + ' - ' + balance + ' ODT');
    }).catch(function(err) {
      console.log(err.message);
    });

  },

  handleSetRate: function(event) {

    event.preventDefault();
    var rate = parseInt($('#ODTConversionRate').val());

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      console.log(rate);
      console.log(account);

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;
        return odysseyPresaleToken.setRate(rate, {from: account});
      }).then(function(result) {
        alert('Changed rate successfully!');
      }).catch(function(err) {
        console.log(err.message);
      });
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

    console.log('Mint ' + amount + ' ODT and give to ' + toAddress);

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;
        return odysseyPresaleToken.mint(toAddress, amount, {from: account});
      }).then(function(result) {
        alert('Mint Successful!');
        // TODO: Refresh token values?
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleDisableMinting: function(event) {
    event.preventDefault();

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      let result = confirm("Are you sure you want to disable minting?");
      if(!result){
        return;
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;

        return odysseyPresaleToken.finishMinting({from: account});
      }).then(function(result) {
        alert('Minting disabled successfully!');
        // TODO: Refresh token values?
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleToggleTransfers: function(event) {
    event.preventDefault();

    var odysseyPresaleToken;

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      let result = confirm("Are you sure you want to enable/disable token transfers?");
      if(!result){
        return;
      }

      var account = accounts[0];

      App.contracts.OdysseyPresaleToken.deployed().then(function(instance) {
        odysseyPresaleToken = instance;

        return odysseyPresaleToken.toggleTransfers({from: account});
      }).then(function(result) {
        alert('Enabled/disabled token transfers successfully!');
        // TODO: Refresh token values?
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

  handleSelfDestruct: function(event) {
    event.preventDefault();

    var toAddress = $('#ODTSelfDestructAddress').val();
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
        console.log(toAddress);
        return odysseyPresaleToken.selfDestruct(toAddress, {from: account});
      }).then(function(result) {
        alert('The contract is dead! All hail the contract!');
      }).catch(function(err) {
        console.log(err.message);
      });
    });
  },

};

$(function() {
  $(window).load(function() {
    App.init();
    // Setup event handlers.

  });
});

var element = document.getElementById('ETHPurchaseAmount');
element.addEventListener('input', function (e) {
  convertEthToOdt();
}, false);

var element = document.getElementById('ODTPurchaseAmount');
element.addEventListener('input', function (e) {
  convertOdtToEth();
}, false);


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

/*
  Helper Functions.
*/

// Format token values.
var formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
});

// Allow strings to be capitalized.
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}
