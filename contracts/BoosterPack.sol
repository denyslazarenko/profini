// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "./Profini.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BoosterPack is Ownable {
    uint256 constant PRICE_PER_BOOSTER = 0.00001 ether;
    uint256 constant CARDS_PER_BOOSTER = 3;
    mapping(string => uint256) private cardsClaimed;
    uint256[] private tokenIds;
    address private contractAddress;

    constructor(uint256[] memory _tokenIds, address _contractAddress) {
        tokenIds = _tokenIds;
        contractAddress = _contractAddress;
    }

    function randomNumber(uint256 max) internal view returns (uint256) {
        bytes memory b = abi.encodePacked(
            blockhash(block.number),
            msg.sender,
            max
        );
        bytes32 h = keccak256(b);
        uint256 rndInt = uint256(h);

        return ((rndInt % max) - 1) + 1;
    }

    function drawPack() public payable returns (uint256[] memory) {
        require(msg.value >= PRICE_PER_BOOSTER);

        Profini profini = Profini(contractAddress);

        address[] memory accounts = new address[](tokenIds.length);
        for (uint256 i = 0; i < tokenIds.length; i++) {
            accounts[i] = owner();
        }

        uint256[] memory drawnCards = new uint256[](CARDS_PER_BOOSTER);

        for (uint256 i = 0; i < CARDS_PER_BOOSTER; i++) {
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

            for (uint256 j = 0; j < tokenRanges.length; j++) {
                uint256[] memory range = tokenRanges[j];
                if (rnd >= range[0] && rnd <= range[1]) {
                    uint256 drawnCard = j + 1;
                    drawnCards[i] = drawnCard;

                    profini.safeTransferFrom(
                        owner(),
                        msg.sender,
                        drawnCard,
                        1,
                        ""
                    );
                    break;
                }
            }
        }

        return drawnCards;
    }
}
