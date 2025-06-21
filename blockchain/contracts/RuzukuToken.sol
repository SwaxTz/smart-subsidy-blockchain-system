// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
contract RuzukuToken is ERC20 {
    constructor(uint256 initialSupply) ERC20("Ruzuku", "RZK") {
        _mint(msg.sender, initialSupply);
    }
}
