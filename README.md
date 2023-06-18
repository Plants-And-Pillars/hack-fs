# Zen Garden
## HackFS 2023 Hackathon

## Contracts

### Forest
- An ERC721 contract for a user's forest, has modifiable URI functionality
- Deployed on: Polygon Mumbai
- Deployment address: 0x66D5cC288f86f0A53BA85D2b97Ca780287e89647

### Tree
- An ERC721 contract for the various Tree NFTs that a user can own and plant in their Forest
- This contract uses Chainlink VRF to generate the daily growth points of all the Tree tokens minted from the contract
- This daily growth gets added to the growth points of every minted Tree token and the growth reflects on the frontend as a changed image of the Tree NFT
- This contract also uses Chainlink Automation to call the ```requestRandomWords()``` function every 10 minutes
  - Every 10 minutes is only for hackathon purposes and will be replaced by every day (daily) later 
- Deployed on: Polygon Mumbai
- Deployment address: 0x11e405C734746e129179c576ECBC748C04B006d8

### Chainlink VRF and Chainlink Automation - [Tree.sol](https://github.com/Plants-And-Pillars/chainlink-spring-hack/blob/main/hardhat/contracts/Tree.sol)
