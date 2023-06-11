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
- This contract also uses Chainlink Automation to call the ```requestRandomWords()``` function every 10 minutes
  - Every 10 minutes is only for hackathon purposes and will be replaced by every day (daily) later 
- Deployed on: Polygon Mumbai
- Deployment address: 0x11e405C734746e129179c576ECBC748C04B006d8
