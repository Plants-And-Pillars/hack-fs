/* eslint-disable @next/next/no-img-element */
import { Flex, Heading, Text, useToast } from "@chakra-ui/react";
import { ethers } from "ethers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useContract, useSigner } from "wagmi";

import forestContractABI from "@/contracts/abi/forest.json";
import Image from "next/image";

const ENSForestViewer = () => {
  const toast = useToast();
  const router = useRouter();
  const { data: signerData } = useSigner();
  const { ens } = router.query;

  const [address, setAddress] = useState<string>("");
  const [ipfsURI, setIpfsURI] = useState<string>("");
  const [imageData, setImageData] = useState<string>("");

  const forestContract = useContract({
    address: process.env.NEXT_PUBLIC_FOREST_CONTRACT_ADDRESS,
    abi: forestContractABI,
    signerOrProvider: signerData,
  });

  // resolve ENS name to address
  useEffect(() => {
    (async () => {
      if (!ens) return;

      const provider = new ethers.providers.JsonRpcProvider(
        "https://multi-light-rain.discover.quiknode.pro/0fcae8e2b6266c2d7ff9ea3f35f763d851751d54/"
      );

      const address = await provider.resolveName(ens as string);
      console.log(address);

      if (!address) return;

      setAddress(address);
    })();
  }, [ens]);

  useEffect(() => {
    if (!signerData || !forestContract || !address) return;

    forestContract
      .getTokenIdByAddress(address)
      .then((tx: { toNumber: () => any }) => {
        const tokenId = tx.toNumber();
        console.log("TOKEN ID", tokenId);
        toast({
          title: "Token Id fetched",
          description: "Token Id fetched sucessfully!",
          status: "success",
          duration: 5000,
          isClosable: true,
        });

        forestContract.getTokenURI(tokenId).then((tx: string) => {
          const tokenURI = JSON.parse(tx);
          console.log("tokenURI", tokenURI);
          toast({
            title: "Token URI fetched",
            description: "Token URI fetched sucessfully!",
            status: "success",
            duration: 5000,
            isClosable: true,
          });

          console.log(
            "tokenURI?.ipfsUploadInfo?.cid",
            tokenURI?.ipfsUploadInfo?.cid
          );
          setIpfsURI(tokenURI?.ipfsUploadInfo?.cid);
        });
      })
      .catch((error: any) => {
        console.log("error", error);
      });
  }, [signerData, forestContract, address, toast]);

  useEffect(() => {
    (async () => {
      if (!ipfsURI) return;

      const res = await fetch(`https://ipfs.io/ipfs/${ipfsURI}`);
      const data = await res.blob();
      console.log(data);
      setImageData(URL.createObjectURL(data));
    })();
  }, [ipfsURI]);

  return (
    <Flex
      bgColor="#495e35"
      height="100vh"
      color="white"
      align="center"
      justify="center"
      direction="column"
    >
      <Heading paddingTop={5}>{`${ens}'s Forest`}</Heading>
      {address ? <Text>{address}</Text> : <Text>Loading...</Text>}
      <img
        alt="your forest"
        src={imageData}
        height="500"
        width="500"
      />
    </Flex>
  );
};

export default ENSForestViewer;
