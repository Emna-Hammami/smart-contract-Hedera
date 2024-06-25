// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity >=0.7.0 <0.8.9;

contract HelloHedera {
    address owner; //the contract's owner
    string message; //the message we're storing

    constructor(string memory message_) {
        //set the owner of the contract for "kill()"
        owner = msg.sender;
        message = message_;
    }

    function set_message(string memory message_) public{
        //only the owner can change the message
        if (msg.sender != owner) return;
        message = message_;
    }

    function get_message() public view returns (string memory) {
        return message;
    }

    //recover the funds of the contract
    function kill() public { 
        if (msg.sender == owner ) selfdestruct(payable(msg.sender));
    }
}