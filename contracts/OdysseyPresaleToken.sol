pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract OdysseyPresaleToken is MintableToken {

	/**
	* Implicit dependencies, stemming from MintableToken import.
	*	SafeMath.sol
	* ERC20Basic.sol
	* ERC20.sol
	* BasicToken.sol
	* StandardToken.sol
	* Ownable.sol
	*/

	// Basic token properties. ---------------------------
	string public name = 'OdysseyPresaleToken';
	string public symbol = 'ODT';
	uint public decimals = 18;
	uint public initialSupply = 12000000;

	// Custom properties. ---------------------------
	uint256 public rate; // Conversion rate. 1 ether * rate = number of tokens.
	bool public isTransferEnabled; // Token transfers enabled/disabled.
	bool public isPurchaseEnabled; // Token purchases enabled/disabled.
	address public withdrawalOwner; // Address to which funds can be withdrawn.

	// Custom modifiers. ---------------------------
	modifier onlyWithdrawalOwner {
		require(msg.sender == withdrawalOwner);
		_;
	}

	/**
  * @dev Constructor.
	* @dev FIXME: When using in production, use params to set initial state.
  * @dev Set initial token supply and balances.
  */
	function OdysseyPresaleToken() public {
		totalSupply = initialSupply;
		balances[msg.sender] = initialSupply;
		isTransferEnabled = true;
		isPurchaseEnabled = true;
		rate = 3;
		withdrawalOwner = msg.sender;
	}

	// Setters. ---------------------------

	/**
	* @dev Change the conversion rate at which tokens may be purchased.
	* @param _rate Conversion rate of ether to tokens.
	*/
	function setRate(uint256 _rate) public onlyOwner returns (bool) {
		rate = _rate;
		return true;
	}

	/**
	* @dev Enable or disable the ability to transfer tokens.
	* @dev Should not affect ability to purchase tokens.
	*/
	function toggleTransfers() public onlyOwner returns (bool) {
		isTransferEnabled = !isTransferEnabled;
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
	* @dev Allow the contract owner to set the withdraw address.
	* @dev FIXME: It might be best if this function is removed in production,
	* @dev FIXME: opting to only set withdrawalOwner in the constructor.
	* @param _withdrawalOwner The new withdrawal owner.
	*/
	function transferWithdrawalOwnership(address _withdrawalOwner) public onlyOwner returns (bool) {
		withdrawalOwner = _withdrawalOwner;
		return true;
	}

	// Utility functions. ---------------------------

	/**
 	* @dev Purchase tokens at a set rate.
	* @param _to address The address to which to transfer the tokens.
 	*/
	function purchase(address _to) public payable returns (bool){

		// 1 ether = 10^18 wei. Convert msg.value to ether and multiply by rate.
		uint256 numberOfTokens = (msg.value / 1000000000000000000) * rate;

		require(msg.value != 0);
		require(isPurchaseEnabled);
		require(balances[owner] > numberOfTokens);

		// TODO: There's a better/safer way to do this.
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
		require(isTransferEnabled);

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }

	/**
 	* @dev Withdraw ether to withdrawalOwner address.
	* @dev This separates contract ownership from the management of funds.
	* @dev Think least privilege, separation of concerns.
	* @param _amount The amount of ether to withdraw.
 	*/
	function withdrawEther(uint256 _amount) public payable onlyWithdrawalOwner returns (bool) {
		bool success = withdrawalOwner.send(_amount);
		return success;
	}

	/**
 	* @dev Destroy the contract and drain any ether to withdrawalOwner.
 	*/
	function selfDestruct() public onlyOwner {
		selfdestruct(withdrawalOwner);
	}
}
