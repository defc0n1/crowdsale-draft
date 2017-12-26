pragma solidity ^0.4.18;


import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';


contract Splitter is Pausable {

    mapping(address => uint256) public balances;
    mapping(address => uint256) public split;
    address[] public splitAddrs;

    event LogWithdraw(address indexed beneficiary, uint256 amount);

    function Splitter () public {
        // set addresses and percentages
        // percent value. 10000 = 100%, 75 = 0.75%, 750 = 7.5%, 7500 = 75%
        split[0x627306090abab3a6e1400e9345bc60c78a8bef57] = 75;
        splitAddrs.push(0x627306090abab3a6e1400e9345bc60c78a8bef57);

        split[0xf17f52151ebef6c7334fad080c5704d77216b732] = 9925;
        splitAddrs.push(0xf17f52151ebef6c7334fad080c5704d77216b732);

        uint256 per;
        for (uint256 i = 0; i < splitAddrs.length; i++) {
            per += split[splitAddrs[i]];
        }
        // make sure that you split all 100%
        require(per == 10000);
    }

    function () public payable whenNotPaused {
        if (splitAddrs.length == 0) {
            balances[owner] += msg.value;
        } else {
            for (uint256 i = 0; i < splitAddrs.length; i++) {
                balances[splitAddrs[i]] = msg.value * split[splitAddrs[i]] / 10000;
            }
        }
    }

    function splitLength() public view returns(uint256) {
        return splitAddrs.length;
    }

    function withdraw() public whenNotPaused returns(bool) {
        uint256 value = balances[msg.sender];
        balances[msg.sender] = 0;

        LogWithdraw(msg.sender, value);
        msg.sender.transfer(value);
        return true;
    }

    function withdrawLeftover() public returns(bool) {
        uint256 bal;
        for (uint256 i = 0; i < splitAddrs.length; i++) {
            bal += balances[splitAddrs[i]];
        }
        if (this.balance > bal) {
            owner.transfer(this.balance - bal);
        }
        return true;
    }
}
