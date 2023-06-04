import { create } from 'zustand';

const useSpriteStore = create((set) => ({
    sprites: [],
    setSprites: (sprites) => set(() => ({ sprites })),
    updateSpritePosition: (tokenId, x, y) => set((state) => {
        const sprite = state.sprites.find((sprite) => sprite.tokenId === tokenId);
        const newSprites = state.sprites.filter((sprite) => sprite.tokenId !== tokenId);
        return { sprites: [...newSprites, { ...sprite, x, y }] };
    }),

    forestPixiApp: undefined,
    setForestPixiApp: (forestPixiApp) => set(() => ({ forestPixiApp })),

    forestTokenId: undefined,
    setForestTokenId: (forestTokenId) => set(() => ({ forestTokenId })),

    fetchedNFTs: null,
    setFetchedNFTs: (fetchedNFTs) => set(() => ({ fetchedNFTs })),
    moveAFetchedNFTToSprites: (tokenId, x=50, y=50) => set((state) => {
        const newFetchedNFTs = state.fetchedNFTs.filter((nft) => nft.tokenId !== tokenId);
        const fetchedNFT = state.fetchedNFTs.find((nft) => nft.tokenId === tokenId);
        return {
            fetchedNFTs: newFetchedNFTs, sprites: [...state.sprites, {
                x, y, image: fetchedNFT.media[0].thumbnail, tokenId
            }]
        };
    }
    ),
}))

export default useSpriteStore;