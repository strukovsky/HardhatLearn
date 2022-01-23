// SPDX-License-Identifier: unlicense
import "@openzeppelin/contracts/access/Ownable.sol";
pragma solidity ^0.8.1;

contract LisingToken is Ownable {
    struct Lising {
        address token;
        uint256 lisingStart;
        uint256 lisingEnd;
        uint256 price;
        bool isAborted;
    }
    mapping(address => Lising) _lisings;

    function initLising(
        address owner,
        address token,
        uint256 lisingEnd,
        uint256 price
    ) public {
        require(lisingEnd > block.timestamp, "Incorrect lising end date");
        require(_lisings[owner].token == address(0), "Lising is already presented");
        Lising memory l = Lising(
            token,
            block.timestamp,
            lisingEnd,
            price,
            false
        );
        _lisings[owner] = l;
    }

    function abortLising(address owner) public onlyOwner {
        require(_lisings[owner].token != address(0), "There is no such lising");
        require(!_lisings[owner].isAborted, "Should not be already aborted");
        _lisings[owner].isAborted = true;
    }

    function prolongateLising(address owner, uint256 newLisingEnd)
        public
        onlyOwner
    {
        Lising memory lising = _lisings[owner];
        require(
            lising.token != address(0),
            "No lising is provided for this owner"
        );
        require(
            lising.lisingEnd < newLisingEnd,
            "New lising end date must be greater than old one"
        );
        _lisings[owner].lisingEnd = newLisingEnd;
    }

    function getLising(address owner) public view onlyOwner returns(address, uint256, uint256, uint256, bool){
        Lising memory lising = _lisings[owner];
        require(
            lising.token != address(0),
            "No lising is provided for this owner"
        );

        return (lising.token, lising.lisingStart, lising.lisingEnd, lising.price, lising.isAborted);
    }
}
