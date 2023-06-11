// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@chainlink/contracts/src/v0.8/interfaces/VRFCoordinatorV2Interface.sol";
import "@chainlink/contracts/src/v0.8/VRFConsumerBaseV2.sol";

struct TokenData {
    uint256 tokenId;
    string name;
    uint256 mintedAt;
    uint256 growthScore;
}

contract Tree is
    ERC721,
    ERC721Enumerable,
    ERC721Burnable,
    Ownable,
    VRFConsumerBaseV2
{
    using Counters for Counters.Counter;

    // mappings to store token's metadata
    mapping(uint256 => string) public tokenName;
    mapping(uint256 => uint256) public mintedAt;
    // corresponding to the growth score we'll return the correct img url while fetching NFT state
    mapping(uint256 => uint256) public growthScore;

    Counters.Counter private _tokenIdCounter;

    // growth automation interval (s)
    uint256 private growthInterval = 60;
    uint public lastTimeStamp;

    event RequestSent(uint256 requestId);
    event RequestFulfilled(uint256 requestId, uint256 dailyGrowth);

    struct RequestStatus {
        bool fulfilled; // whether the request has been successfully fulfilled
        bool exists; // whether a requestId exists
    }
    mapping(uint256 => RequestStatus)
        public s_requests; /* requestId --> requestStatus */
    VRFCoordinatorV2Interface COORDINATOR;

    // Your subscription ID.
    uint64 s_subscriptionId;

    // past requests Id.
    uint256[] public requestIds;
    uint256 public lastRequestId;

    // https://docs.chain.link/docs/vrf/v2/subscription/supported-networks/#configurations
    bytes32 keyHash =
        0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f;

    uint32 callbackGasLimit = 100000;

    uint16 requestConfirmations = 3;

    uint32 numWords = 1;

    constructor(
        uint64 subscriptionId
    )
        ERC721("Tree", "TRE")
        VRFConsumerBaseV2(0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed)
    {
        lastTimeStamp = block.timestamp;
        COORDINATOR = VRFCoordinatorV2Interface(
            0x7a1BaC17Ccc5b313516C5E16fb24f7659aA5ebed
        );
        s_subscriptionId = subscriptionId;
    }

    function setGrowthInterval(uint256 interval) public onlyOwner {
        growthInterval = interval;
    }

    // Chainlink VRF functions

    // Assumes the subscription is funded sufficiently.
    function requestRandomWords()
        external
        returns (uint256 requestId)
    {
        require((block.timestamp - lastTimeStamp) > growthInterval);
        
        // Will revert if subscription is not set and funded.
        requestId = COORDINATOR.requestRandomWords(
            keyHash,
            s_subscriptionId,
            requestConfirmations,
            callbackGasLimit,
            numWords
        );
        s_requests[requestId] = RequestStatus({
            exists: true,
            fulfilled: false
        });
        requestIds.push(requestId);
        lastRequestId = requestId;
        emit RequestSent(requestId);
        return requestId;
    }

    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(s_requests[_requestId].exists, "request not found");

        lastTimeStamp = block.timestamp;

        s_requests[_requestId].fulfilled = true;

        // update the growth score of all the tokens
        uint256 dailyGrowth = (_randomWords[0] % 100)+1;
        uint256 tokenCount = totalSupply();
        uint256 index;
        for(index=0;index<tokenCount;index++){
            uint256 tokenId = tokenByIndex(index);
            growthScore[tokenId] += dailyGrowth;
        }

        emit RequestFulfilled(_requestId, dailyGrowth);
    }

    // Token related functions

    function safeMint(address to, string memory name) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);

        // store the metadata
        tokenName[tokenId] = name;
        mintedAt[tokenId] = block.timestamp;
        growthScore[tokenId] = 0;
    }

    function getTokensOfAddress(
        address _owner
    ) public view returns (TokenData[] memory) {
        uint256 tokenCount = balanceOf(_owner);
        if (tokenCount == 0) {
            return new TokenData[](0);
        } else {
            TokenData[] memory result = new TokenData[](tokenCount);
            uint256 index;
            for (index = 0; index < tokenCount; index++) {
                uint256 tokenId = tokenOfOwnerByIndex(_owner, index);
                // imageURL will be fetched from the growthScore on frontend
                result[index] = TokenData({
                    tokenId: tokenId,
                    name: tokenName[tokenId],
                    mintedAt: mintedAt[tokenId],
                    growthScore: growthScore[tokenId]
                });
            }
            return result;
        }
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId,
        uint256 batchSize
    ) internal override(ERC721, ERC721Enumerable) {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function supportsInterface(
        bytes4 interfaceId
    )
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
