import { Container, useApp } from "@pixi/react";

import useSpriteStore from "../../store/useSpriteStore";
import DraggableSprite from "./DraggableSprite";
import { useEffect } from "react";

const DraggableSpritesContent = () => {
  const app = useApp();
  const { sprites, setForestPixiApp } = useSpriteStore((state) => ({
    sprites: state.sprites,
    setForestPixiApp: state.setForestPixiApp,
  }));

  useEffect(() => {
    setForestPixiApp(app);
  }, [app]);

  return (
    <Container>
      {sprites.map((sprite) => (
        <DraggableSprite
          tokenId={sprite.tokenId}
          x={sprite.x}
          y={sprite.y}
          key={sprite.tokenId}
          image={sprite.image}
        />
      ))}
    </Container>
  );
};

export default DraggableSpritesContent;
