# Zen Garden
## HackFS 2023 Hackathon

## Contracts

### [Forest](https://github.com/Plants-And-Pillars/hack-fs/blob/main/hardhat/contracts/Forest.sol)
- An ERC721 contract for a user's forest, has modifiable URI functionality
- Deployed on: Polygon Mumbai
- Deployment address: 0x66D5cC288f86f0A53BA85D2b97Ca780287e89647

### [Tree](https://github.com/Plants-And-Pillars/hack-fs/blob/main/hardhat/contracts/Tree.sol)
- An ERC721 contract for the various Tree NFTs that a user can own and plant in their Forest
- This contract uses Chainlink VRF to generate the daily growth points of all the Tree tokens minted from the contract
- This daily growth gets added to the growth points of every minted Tree token and the growth reflects on the frontend as a changed image of the Tree NFT
- This contract also uses Chainlink Automation to call the ```requestRandomWords()``` function every 10 minutes
  - Every 10 minutes is only for hackathon purposes and will be replaced by every day (daily) later 
- Deployed on: Polygon Mumbai
- Deployment address: 0x11e405C734746e129179c576ECBC748C04B006d8

### How its Made
- The project incorporates React Pixijs for facilitating the drag-and-drop functionality of NFT Trees owned by users in their Zen Garden.

- Tree and Forest contracts are deployed on FVM.

- Zen Garden of different individuals(building/working on FVM) and companies(storage providers) will help Filecoin ecosystem to keep track of carbon offsets and RECs (renewable energy credits) to track the network’s total carbon footprint over time. Perhaps these RECs and offsets be minted and tracked natively on FVM.
This would enable secondary lending markets (filtered by sustainability claims), SP insurance underwriting based on sustainability inputs, and a whole lot more. - [Code Integration](https://github.com/Plants-And-Pillars/hack-fs/blob/main/hardhat/contracts/Tree.sol)

- Polybase is used for dynamic Tree NFT metadata which is integrated with drand - [Code Integration](https://github.com/Plants-And-Pillars/hack-fs/blob/polybase/ui/src/pages/index.tsx)

- Drand is used to generate a random number which gamifies the experience and gives every tree NFT random Growth points - [Code Integration](https://github.com/Plants-And-Pillars/hack-fs/blob/main/hardhat/contracts/Tree_new.sol)

- ENS is used for the people to access their Forests - [Code Integration](https://github.com/Plants-And-Pillars/hack-fs/blob/main/ui/src/pages/forest/%5Bens%5D.tsx)

