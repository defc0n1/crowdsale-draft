pragma solidity ^0.4.18;

import 'zeppelin-solidity/contracts/token/MintableToken.sol';

contract OdysseyToken is MintableToken {

	// Properties. ---------------------------
	string public name = 'OdysseyToken';
	string public symbol = 'ODT';
	uint public decimals = 18;
	uint public initialSupply = 12000000;
	bool public isTransferEnabled; // Token transfers enabled/disabled.

	/**
  * @dev Constructor.
	* @dev FIXME: When using in production, use params to set initial state.
  * @dev Set initial token supply and balances.
  */
	function OdysseyToken() public {
		totalSupply = initialSupply;
		balances[msg.sender] = initialSupply;
		isTransferEnabled = true;
	}

	// From BurnableToken.sol. ---------------------------

	event Burn(address indexed burner, uint256 value);

  /**
   * @dev Burns a specific amount of tokens.
   * @param _value The amount of token to be burned.
   */
  function burn(uint256 _value) public {
      require(_value > 0);
      require(_value <= balances[msg.sender]);
      // no need to require value <= totalSupply, since that would imply the
      // sender's balance is greater than the totalSupply, which *should* be an assertion failure

      address burner = msg.sender;
      balances[burner] = balances[burner].sub(_value);
      totalSupply = totalSupply.sub(_value);
      Burn(burner, _value);
  }

	// Override transfer(). ---------------------------

	/**
	* @dev Enable or disable the ability to transfer tokens.
	* @dev Should not affect ability to purchase tokens.
	*/
	function toggleTransfers() public onlyOwner returns (bool) {
		isTransferEnabled = !isTransferEnabled;
		return true;
	}

	/**
  * @dev Transfer tokens to a specified address.
	* @dev Overrides the normal transfer() function
	* @dev to add a check for isTransferEnabled.
  * @param _to The address to transfer to.
  * @param _value The amount to be transferred.
  */
  function transfer(address _to, uint256 _value) public returns (bool) {
    require(_to != address(0));
    require(_value <= balances[msg.sender]);
		require(isTransferEnabled); // Allows token transfers to be disabled.

    // SafeMath.sub will throw if there is not enough balance.
    balances[msg.sender] = balances[msg.sender].sub(_value);
    balances[_to] = balances[_to].add(_value);
    Transfer(msg.sender, _to, _value);
    return true;
  }
}
