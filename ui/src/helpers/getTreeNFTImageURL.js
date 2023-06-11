const getTreeNFTImageURL = (treeGrowthScore) => {
    let treeSize;

    if (treeGrowthScore >= 0 && treeGrowthScore < 30) {
        treeSize = 'small';
    }
    else if (treeGrowthScore >= 30 && treeGrowthScore < 80) {
        treeSize = 'medium';
    }
    else {
        treeSize = 'large';
    }

    return `https://lime-jittery-panda-571.mypinata.cloud/ipfs/QmVvrRJLkbE4Yfs3zY854dYUVVjUrBu2C3BJrz5vKjBSb7/tree-${treeSize}.png`;
}

export default getTreeNFTImageURL