import { useEffect } from "react";
import { useAccount, useContract, useSigner } from "wagmi";
import { Stage } from "@pixi/react";
import { create } from "ipfs-http-client";

import useSpriteStore from "@/store/useSpriteStore";
import DraggableSpritesContent from "./DraggableSpritesContent";

import forestContractABI from "@/contracts/abi/forestContractABI.json";

import { Button, Flex, useToast } from "@chakra-ui/react";

// type ForestTokenURIType = {
//   sprites: {
//     x: number,
//     y: number,
//     tokenId: string,
//   },
//   ipfsUploadInfo: {
//     cid: string,
//     path: string,
//   },
// };

const DraggableSprites = () => {
  const toast = useToast();

  const { data: signerData } = useSigner();

  const forestContract = useContract({
    address: process.env.NEXT_PUBLIC_FOREST_CONTRACT_ADDRESS,
    abi: forestContractABI,
    signerOrProvider: signerData,
  });

  const {
    forestPixiApp,
    forestTokenId,
    setForestTokenId,
    moveAFetchedNFTToSprites,
    sprites,
  } = useSpriteStore((state) => ({
    forestPixiApp: state.forestPixiApp,
    forestTokenId: state.forestTokenId,
    setForestTokenId: state.setForestTokenId,
    moveAFetchedNFTToSprites: state.moveAFetchedNFTToSprites,
    sprites: state.sprites,
  }));

  const captureForestState = async () => {
    const forestSnapshotURL = forestPixiApp.view.toDataURL();
    console.log("forestSnapshotURL", forestSnapshotURL);

    // upload the dataURL to IPFS
    const client = await create({
      url: `https://zengarden-f89e.eks-india.settlemint.com/${process.env.NEXT_PUBLIC_IPFS_API_URL}/api/v0/`,
    });
    const addedData = await client.add({
      path: `forestsnapshot-${forestTokenId}.png`,
      content: forestSnapshotURL,
    });
    console.log("cid", addedData.cid.toString());

    // create the URI object
    const newForestTokenURI = {
      sprites: sprites.map((sprite) => ({
        x: sprite.x,
        y: sprite.y,
        tokenId: sprite.tokenId,
      })),
      ipfsUploadInfo: {
        cid: addedData.cid.toString(),
        path: addedData.path,
      },
    };

    forestContract
      .modifyTokenURI(forestTokenId, JSON.stringify(newForestTokenURI))
      .then((tx) => tx.wait())
      .then((tx) => {
        console.log("tx", tx);
        toast({
          title: "Token URI updated",
          description: "Token URI updated sucessfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      });
  };

  useEffect(() => {
    if (!signerData || !forestContract) return;

    forestContract
      .getTokenId()
      .then((tx) => {
        const tokenId = tx.toNumber();
        console.log("TOKEN ID", tokenId);
        toast({
          title: "Token Id fetched",
          description: "Token Id fetched sucessfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        // storing the token id (as a string) in the global state
        setForestTokenId("" + tokenId);
      })
      .catch((error) => {
        console.log("error", error);
        if (error.reason === "ERC721: caller does not have a token") {
          toast({
            title: "Token not found",
            description:
              "Looks like you dont have a token yet, minting one for you now!",
            status: "info",
            duration: 5000,
            isClosable: true,
          });

          const initURI = {
            sprites: [],
            ipfsUploadInfo: {
              cid: "",
              path: "",
            },
          };
          forestContract
            .safeMint(JSON.stringify(initURI))
            .then((tx) => {
              tx.wait().then(() => {
                console.log("token minted");
                toast({
                  title: "Token minted",
                  description: "Token minted sucessfully!",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                console.log("safeMint", tx);

                // reload and fetch the tokenID
                window.location.reload();
              });
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      });
  }, [signerData, forestContract]);

  useEffect(() => {
    console.log("forestTokenId", forestTokenId);
    if (!forestTokenId) return;

    forestContract
      .getTokenURI(forestTokenId)
      .then((tx) => {
        const tokenURI = JSON.parse(tx);
        console.log("tokenURI", tokenURI);
        toast({
          title: "Token URI fetched",
          description: "Token URI fetched sucessfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        tokenURI.sprites.forEach((sprite) => {
          moveAFetchedNFTToSprites(sprite.tokenId, sprite.x, sprite.y);
        });
      })
      .catch((error) => {
        console.log("error", error);
      });
  }, [forestTokenId]);

  useEffect(() => {
    console.log("sprites", sprites);
  }, [sprites]);

  return (
    <Flex direction="column">
      <Stage options={{ backgroundColor: "#e0d9c9" }}>
        <DraggableSpritesContent />
      </Stage>
      <Button isDisabled={!forestPixiApp} onClick={captureForestState}>
        Capture
      </Button>
    </Flex>
  );
};

export default DraggableSprites;
