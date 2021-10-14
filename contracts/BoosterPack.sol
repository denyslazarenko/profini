// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Profini.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoosterPack is Ownable {
    uint256 constant PRICE_PER_BOOSTER = 0.001 ether;
    mapping(string => uint256) private cardsClaimed;
    uint256[] private tokenIds;
    address private contractAddress;

    constructor(uint256[] memory _tokenIds, address _contractAddress) {
        tokenIds = _tokenIds;
        contractAddress = _contractAddress;
    }

    function randomNumber(uint256 max) internal returns (uint256) {
        return max;
    }

    function drawPack() public payable {
        require(msg.value >= PRICE_PER_BOOSTER);

        Profini profini = Profini(contractAddress);

        address[] memory accounts = new address[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            accounts[i] = owner();
        }

        for (uint256 i = 0; i < 3; i++) {
            uint256[] memory balances = profini.balanceOfBatch(
                accounts,
                tokenIds
            );

            uint256 totalBalance = 0;
            uint256[][] memory tokenRanges = new uint256[][](
                balances.length - 1
            );

            for (uint256 j = 0; j < balances.length; j++) {
                uint256 start = totalBalance + 1;
                uint256 balance = balances[j];
                totalBalance += balance;
                uint256 end = totalBalance;
                uint256[] memory tuple = new uint256[](2);
                tuple[0] = start;
                tuple[1] = end;
                tokenRanges[j] = tuple;
            }

            uint256 rnd = randomNumber(totalBalance);
        }
    }
}
