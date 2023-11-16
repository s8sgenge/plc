import { Container, useApp } from '@pixi/react';
import { FederatedPointerEvent } from '@pixi/events';
import '@pixi/events';
import { Tile, TileGraphic } from './Tile';

export interface TileGridProps {
  rows: number;
  columns: number;
  colorMap: { [key: number]: string };
  demoImage: number[][];
  defaultTileColor: string;
}

export const TileGrid = (props: TileGridProps) => {
  const app = useApp();
  const tileWidth = app.view.width / props.rows - 1;

  let currentColor = 0;
  let draggedTiles: TileGraphic[] = [];
  let dragging = false;
  let draggingCoordinate = { row: -1, column: -1 };

  const updateTileColor = (tile: TileGraphic, color: string) => {
    if (!tile.correct) {
      tile.clear();
      tile.beginFill(color);
      tile.drawRect(tile.xPosition, tile.yPosition, tileWidth, tileWidth);
      tile.endFill();
    }
  };

  const updateRowAndColumnAlpha = (x: number, y: number, alpha: number) => {
    const tileContainer = app.stage.children[0];

    if (tileContainer.children && tileContainer.children.length > y) {
      tileContainer.children.forEach((tileArray) => {
        if (tileArray.children) {
          const tile = tileArray.children[y] as TileGraphic;
          tile.alpha = alpha;
        }
      });

      const row = tileContainer?.children[x];
      if (row.children && row.children.length > 0) {
        row.children.forEach((g) => {
          const tile = g as TileGraphic;
          tile.alpha = alpha;
        });
      }
    }
  };

  const isCorrect = (tile: TileGraphic) => {
    if (currentColor !== props.demoImage[tile.row][tile.column]) {
      return false;
    }
    return true;
  };

  const handlePointerUp = () => {
    draggedTiles.forEach((tile) => {
      if (!isCorrect(tile)) {
        updateTileColor(tile, props.defaultTileColor);
      } else {
        tile.correct = true;
      }
      tile.alpha = 1;
    });
    draggedTiles = [];
    dragging = false;
    draggingCoordinate = { row: -1, column: -1 };
  };

  const handleTileClick = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    if (isCorrect(tile)) {
      updateTileColor(tile, props.colorMap[0]);
      tile.correct = true;
    }
  };

  const handleTileMouseOver = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    const isDrag = event.data.buttons === 1;
    console.log(tile.column, tile.row);
    if (isDrag) {
      if (dragging === false) {
        draggingCoordinate.row = tile.row;
        draggingCoordinate.column = tile.column;
        dragging = true;
      }
      if (
        tile.row !== draggingCoordinate.row &&
        tile.column !== draggingCoordinate.column
      ) {
        draggedTiles.forEach((g) => {
          updateTileColor(g, props.defaultTileColor);
        });
        draggedTiles = [];
        draggingCoordinate = { row: -1, column: -1 };
      } else {
        draggedTiles.push(tile);
        updateTileColor(tile, props.colorMap[0]);
      }
    }
    updateRowAndColumnAlpha(tile.row, tile.column, 0.8);
  };

  const handleTileMouseLeave = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    const isDrag = event.data.buttons === 1;
    if (isDrag) {
      tile.alpha = 1;
      draggedTiles.push(tile);
    }
    updateRowAndColumnAlpha(tile.row, tile.column, 1);
  };

  const createGrid = (w: number, h: number) => {
    const elements = [];
    for (let x = 0; x < w; x++) {
      const rowElements = [];
      for (let y = 0; y < h; y++) {
        rowElements.push(
          <Tile
            key={x + w * y}
            id={x + w * y}
            x={x}
            y={y}
            width={tileWidth}
            height={tileWidth}
            color={props.defaultTileColor}
            onTileClick={handleTileClick}
            onTileMouseEnter={handleTileMouseOver}
            onTileMouseLeave={handleTileMouseLeave}
            onPointerUp={handlePointerUp}
          />
        );
      }
      elements.push(<Container key={x * w}>{rowElements}</Container>);
    }
    return elements;
  };

  return (
    <Container pointerupoutside={handlePointerUp} pointerup={handlePointerUp}>
      {createGrid(props.rows, props.columns)}
    </Container>
  );
};
