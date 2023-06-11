import { useCallback, useEffect } from "react";
import { Stage } from "@pixi/react";

import { useAccount, useContract, useContractEvent, useSigner } from "wagmi";

import useSpriteStore from "../../store/useSpriteStore";
import CustomSprite from "./CustomSprite";
import getTreeNFTImageURL from "@/helpers/getTreeNFTImageURL";
import { Flex, Text } from "@chakra-ui/layout";

import treeContractABI from "@/contracts/abi/tree.json";

const ListOfSprites = () => {
  const { address } = useAccount();
  const { data: signerData } = useSigner();

  const treeContract = useContract({
    address: process.env.NEXT_PUBLIC_TREE_CONTRACT_ADDRESS,
    abi: treeContractABI,
    signerOrProvider: signerData,
  });

  // listen to event emitted once the growth score is updated
  useContractEvent({
    address: process.env.NEXT_PUBLIC_TREE_CONTRACT_ADDRESS,
    abi: treeContractABI,
    eventName: 'RequestFulfilled',
    listener(node, label, owner) {
      console.log(node, label, owner);
      fetchTreeNFTs();
    },
  })

  const moveAFetchedNFTToSprites = useSpriteStore(
    (state) => state.moveAFetchedNFTToSprites
  );
  const fetchedNFTs = useSpriteStore((state) => state.fetchedNFTs);
  const setFetchedNFTs = useSpriteStore((state) => state.setFetchedNFTs);

  const handleClick = useCallback(
    (nft) => {
      moveAFetchedNFTToSprites(nft.tokenId);
    },
    [moveAFetchedNFTToSprites]
  );

  const fetchTreeNFTs = () => {
    if (!address || !signerData || !treeContract) return;

    treeContract.getTokensOfAddress(address).then((tokenData) => {
      console.log("tokenData", tokenData);
      const fetchedNFTs = tokenData.map(
        ({ tokenId, name, mintedAt, growthScore }) => {
          const imageURL = getTreeNFTImageURL(growthScore);

          return {
            tokenId: tokenId.toNumber(),
            name,
            mintedAt: mintedAt.toNumber(),
            growthScore: growthScore.toNumber(),
            imageURL,
          };
        }
      );
      setFetchedNFTs(fetchedNFTs);
    });
  };

  useEffect(() => {
    fetchTreeNFTs();
  }, [address, signerData, treeContract, setFetchedNFTs]);

  return (
    <Flex padding={10} bgColor="#725A10">
      {fetchedNFTs !== null ? (
        <Stage width={400} options={{ backgroundColor: "#725A10"}}>
          {fetchedNFTs.map((fetchedNFT, index) => (
            <CustomSprite
              key={fetchedNFT.tokenId}
              x={index % 2 * 220}
              y={Math.floor(index / 2) * 240}
              image={fetchedNFT.imageURL}
              onClick={() => handleClick(fetchedNFT)}
            />
          ))}
        </Stage>
      ) : (
        <Text color="white">Loading...</Text>
      )}
    </Flex>
  );
};

export default ListOfSprites;
