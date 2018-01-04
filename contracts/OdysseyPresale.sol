pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/math/SafeMath.sol';
import './OdysseyToken.sol';

contract OdysseyPresale is Ownable {

  using SafeMath for uint256;
  // Properties. ---------------------------
  OdysseyToken public token; // The token being sold.
  address public owner; // Owner of the contract.
  address public wallet; // Address to which funds can be withdrawn.
  bool public isPurchaseEnabled; // Token purchases enabled/disabled.
  uint256 public rate; // Conversion rate. 1 ether * rate = number of tokens.
  event Purchase(address indexed from, address indexed to, uint256 value);

  /**
  * @dev Constructor.
  * @dev Set initial contract state.
  */
  function OdysseyPresaleToken() public {
    token = new OdysseyToken();
    owner = msg.sender;
    wallet = msg.sender;
    isPurchaseEnabled = true;
    rate = 60;
  }

  /**
  * @dev Change the conversion rate at which tokens may be purchased.
  * @param _rate Conversion rate of ether to tokens.
  */
  function setRate(uint256 _rate) public onlyOwner returns (bool) {
    rate = _rate;
    return true;
  }

  /**
  * @dev Enable or disable the ability to purchase tokens.
  * @dev Should not affect ability to transfer tokens.
  */
  function togglePurchases() public onlyOwner returns (bool) {
    isPurchaseEnabled = !isPurchaseEnabled;
    return true;
  }

  /**
  * @dev Purchase tokens at a set rate.
  * @dev Internally calls OdysseyToken.sol transfer() function.
  * @param _to address The address to which to transfer the tokens.
  https://ethereum.stackexchange.com/questions/8222/access-struct-object-of-one-contract-from-another#8223
  */
  function purchase(address _to) public payable returns (bool) {
    require(msg.value != 0);
    require(isPurchaseEnabled); // Allows token purchases to be disabled.

    // 1 ether = 10^18 wei. Convert msg.value to ether and multiply by rate.
    uint256 numberOfTokens = (msg.value / 1000000000000000000) * rate;
    forwardFunds(); // Get the ether first. Then transfer the tokens.
    token.transfer(_to, numberOfTokens);

    // Trigger purchase event.
    Purchase(msg.sender, _to, numberOfTokens);
    return true;
  }

  /*
  * @dev Send ether to the fund collection wallet.
  * @dev Override to create custom fund forwarding mechanisms.
  */
  function forwardFunds() internal {
    wallet.transfer(msg.value);
  }

  /**
  * @dev Destroy the contract and drain any ether to withdrawalOwner.
  * @dev FIXME: This might be best left out in production.
  */
  function selfDestruct() public onlyOwner {
    selfdestruct(wallet);
  }
}
