import React, { useEffect } from "react";
import * as PIXI from 'pixi.js';
import useSpriteStore from "@/store/useSpriteStore";

PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.NEAREST

const useDrag = ({ tokenId, x, y }) => {
  const { updateSpritePosition } = useSpriteStore((state) => ({
    updateSpritePosition: state.updateSpritePosition
  }));

  const sprite = React.useRef();
  const [isDragging, setIsDragging] = React.useState(false);
  const [position, setPosition] = React.useState({ x, y });

  const onDown = React.useCallback(() => setIsDragging(true), []);
  const onUp = React.useCallback(() => setIsDragging(false), []);
  const onMove = React.useCallback(e => {
    if (isDragging && sprite.current) {
      setPosition(e.data.getLocalPosition(sprite.current.parent));
    }
  }, [isDragging, setPosition]);

  useEffect(() => {
    if (isDragging) return;

    // update position in store
    console.log('updateSpritePosition', tokenId, position.x, position.y);
    updateSpritePosition(tokenId, position.x, position.y);
  }, [isDragging]);

  return {
    ref: sprite,
    interactive: true,
    pointerdown: onDown,
    pointerup: onUp,
    pointerupoutside: onUp,
    pointermove: onMove,
    alpha: isDragging ? 0.5 : 1,
    anchor: 0.5,
    position,
  };
};

export default useDrag;