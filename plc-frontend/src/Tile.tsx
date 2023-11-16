import { Graphics } from '@pixi/react';
import { FederatedPointerEvent, Graphics as GraphicsType } from 'pixi.js';
import { FC } from 'react';

export interface TileGraphic extends GraphicsType {
  xPosition: number;
  yPosition: number;
  row: number;
  column: number;
  correct: boolean;
  id: number;
}

export interface TileProps {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  color: string;
  onTileClick: (e: FederatedPointerEvent) => void;
  onTileMouseEnter: (e: FederatedPointerEvent) => void;
  onTileMouseLeave: (e: FederatedPointerEvent) => void;
  onPointerUp: (e: FederatedPointerEvent) => void;
}

export const Tile: FC<TileProps> = (props: TileProps) => {
  const xPosition = props.x * (props.width + 1);
  const yPosition = props.y * (props.height + 1);
  const drawRectangle = (
    graphic: TileGraphic,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
  ) => {
    graphic.clear();
    graphic.beginFill(color);
    graphic.drawRect(x, y, width, height);
    graphic.endFill();
  };

  return (
    <Graphics
      interactive={true}
      cursor="pointer"
      draw={(g: TileGraphic) => {
        drawRectangle(
          g,
          xPosition,
          yPosition,
          props.width,
          props.height,
          props.color
        );
        g.id = props.id;
        g.xPosition = xPosition;
        g.yPosition = yPosition;
        g.row = props.x;
        g.column = props.y;
        g.correct = false;
        return g;
      }}
      pointerdown={props.onTileClick}
      pointerover={props.onTileMouseEnter}
      pointerout={props.onTileMouseLeave}
      pointerup={props.onPointerUp}
    />
  );
};
