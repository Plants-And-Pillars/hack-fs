import { Sprite } from "@pixi/react";
import useDrag from "@/hooks/useDrag";

export const DraggableSprite = ({ tokenId, x, y, image, ...props }) => {
  const bind = useDrag({ tokenId, x, y });

  return (
    <Sprite
      image={image}
      scale={0.5}
      {...bind}
      {...props}
    />
  );
};

export default DraggableSprite;
