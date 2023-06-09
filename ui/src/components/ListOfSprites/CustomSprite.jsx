import { Sprite } from "@pixi/react";

const CustomSprite = ({ x, y, image, onClick }) => {
  return (
    <Sprite
      image={image}
      scale={0.5}
      x={x}
      y={y}
      interactive={true}
      onpointerup={onClick}
    />
  );
};

export default CustomSprite;
