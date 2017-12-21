pragma solidity ^0.4.4;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract OdysseyPresaleToken is MintableToken {

	string public name = 'OdysseyPresaleToken';
	string public symbol = 'ODT';
	uint public decimals = 18;
	uint public INITIAL_SUPPLY = 12000000;

	/**
  * @dev MintableToken constructor.
  * Sets the initial token supply and balances.
  */
	function OdysseyPresaleToken() public {
		totalSupply = INITIAL_SUPPLY;
		balances[msg.sender] = INITIAL_SUPPLY;
	}

	// Conversion rate. 1 ether * rate = number of tokens.
	uint256 public rate = 3;
	/**
  * @dev Gets the current token conversion rate.
  * @return An uint256 representing the current conversion rate.
  */
	function rate() public view returns (uint256) {
		return rate;
	}

	/**
 	* @dev Purchase tokens at a set rate.
	* @param _to address The address to which to transfer the tokens.
 	*/
	function purchase(address _to) public payable returns (bool){

		// 1 ether = 10^18 wei. Convert msg.value to ether and multiply by rate.
		uint256 numberOfTokens = (msg.value / 1000000000000000000) * rate;

		// There are not enough tokens to purchase.
		// TODO: Think about what happens to the ETH...
		if(balances[owner] < numberOfTokens){
			revert();
		}

		// TODO: There's a better way to do this.
		balances[owner] -= numberOfTokens;
		balances[_to] += numberOfTokens;
		return true;
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
 	* @dev Destroy the contract and drain any ether to a specified address.
	* @param _to address The address to which to transfer any ether.
 	*/
	function selfDestruct(address _to) public onlyOwner {
		selfdestruct(_to);
	}
}
