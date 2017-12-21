pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract OdysseyPresaleToken is MintableToken {

	string public name = 'OdysseyPresaleToken';
	string public symbol = 'ODT';
	uint public decimals = 18;
	uint public INITIAL_SUPPLY = 12000000;

	// Conversion rate. 1 ether * rate = number of tokens.
	uint256 public rate;
	// Allow owner to enable/disable token transfers.
	bool public isTransferEnabled;
	// Allow owner to enable/disable purchase of tokens.
	bool public isPurchaseEnabled;

	/**
  * @dev Constructor.
  * Set the initial token supply and balances.
  */
	function OdysseyPresaleToken() public {
		totalSupply = INITIAL_SUPPLY;
		balances[msg.sender] = INITIAL_SUPPLY;
		isTransferEnabled = true;
	}

	/**
	* @dev Change the conversion rate at which tokens may be purchased.
	* @param _rate The conversion rate of wei to tokens.
	*/
	function setRate(uint256 _rate) public onlyOwner returns (bool) {
		rate = _rate;
		return true;
	}

	/**
	* @dev Enable or disable the ability to transfer tokens.
	* @dev This is useful to prevent premature or unfair access to exchanges.
	* @dev Note that actually using this bool isn't trivial.
	* @dev Disabling transfers shouldn't disable purchases.
	*/
	function toggleTransfers() public onlyOwner returns (bool) {
		isTransferEnabled = !isTransferEnabled;
		return true;
	}

	/**
	* @dev Enable or disable the ability to purchase tokens.
	*/
	function togglePurchases() public onlyOwner returns (bool) {
		isPurchaseEnabled = !isPurchaseEnabled;
		return true;
	}

	/**
 	* @dev Purchase tokens at a set rate.
	* @param _to address The address to which to transfer the tokens.
 	*/
	function purchase(address _to) public payable returns (bool){

		// 1 ether = 10^18 wei. Convert msg.value to ether and multiply by rate.
		uint256 numberOfTokens = (msg.value / 1000000000000000000) * rate;

		require(msg.value != 0);
		require(isPurchaseEnabled);
		require(balances[owner] < numberOfTokens);

		// TODO: There's a better way to do this.
		balances[owner] -= numberOfTokens;
		balances[_to] += numberOfTokens;
	}

	/**
  * @dev Transfer tokens to a specified address.
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);
		// Transfers should not be allowed if isTransferEnabled is false,
		// unless msg.sender is the contract owner.
		require(isTransferEnabled || msg.sender == owner);

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

	/**
 	* @dev Destroy the contract and drain any ether to a specified address.
	* @param _to address The address to which to transfer any ether.
 	*/
	function selfDestruct(address _to) public onlyOwner {
		selfdestruct(_to);
	}
}
