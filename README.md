# Zen Garden
## Chainlink Spring Hackathon

## Contracts

### Forest
- An ERC721 contract for a user's forest, has modifiable URI functionality
- Deployed on: Polygon Mumbai
- Deployment address: 0x12424AE8c81855f9433FdAa3eedcF63411CA4966

### Tree
- An ERC721 contract for the various Tree NFTs that a user can own and plant in their Forest
- This contract uses Chainlink VRF to generate the daily growth points of all the Tree tokens minted from the contract
- This daily growth gets added to the growth points of every minted Tree token and the growth reflects on the frontend as a changed image of the Tree NFT
- This contract also uses Chainlink Automation to call the ```requestRandomWords()``` function every minute
  - Every minute is only for hackathon purposes and will be replaced by every day later
- Deployed on: Polygon Mumbai
- Deployment address: 0xfb4B155ac3385e6e1F3Ea1cEb8f667e09DeF54AD
