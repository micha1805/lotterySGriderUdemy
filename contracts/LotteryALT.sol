// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

contract Lottery {
    address public manager;
    address payable public winner;
    uint public indexWinner;
    address payable[] public players;

    constructor(){
        manager = msg.sender;
    }
    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(payable(msg.sender));
    }

    function pseudoRandom() private view returns(uint){
        return uint(keccak256(abi.encodePacked(block.difficulty, block.timestamp, players)));
    }

    function pickWinner() public payable restricted returns(address){

        indexWinner = pseudoRandom() % players.length;
        winner = players[indexWinner];
        winner.transfer(address(this).balance);
        players = new address payable[](0);
        return winner;
    }

    modifier restricted(){
        // only the manager can call this function:
        require(msg.sender == manager);
        _;
    }

    function getPlayers() public view returns(address payable[] memory){
        return players;
    }
}
