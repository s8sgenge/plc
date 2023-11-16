import { Container, useApp } from '@pixi/react';
import { FederatedPointerEvent } from '@pixi/events';
import '@pixi/events';
import { Tile, TileGraphic } from './Tile';
import { Text, Container as ContainerInstance } from 'pixi.js';
export interface TileGridProps {
  rows: number;
  columns: number;
  currentColor: number;
  colorMap: { [key: number]: string };
  demoImage: number[][];
  defaultTileColor: string;
}

export const TileGrid = (props: TileGridProps) => {
  const app = useApp();
  const tileWidth = app.view.width / props.rows - 1;

  let draggedTiles: TileGraphic[] = [];
  let dragging = false;
  let draggingCoordinate = { row: -1, column: -1 };
  let draggingDirection: string | undefined = undefined;

  let clickedTile = { row: -1, column: -1 };

  const getColumn = (row: number): TileGraphic[] | undefined => {
    const tileContainer = app.stage.children[0];
    if (tileContainer.children) {
      const rowChildren = tileContainer?.children[row].children;
      const tileRow: TileGraphic[] = [];
      rowChildren?.forEach((element) => {
        tileRow.push(element as TileGraphic);
      });
      return tileRow;
    }
  };

  const getRow = (column: number): TileGraphic[] | undefined => {
    const tileContainer = app.stage.children[0];
    const tileColumn: TileGraphic[] = [];
    if (tileContainer.children && tileContainer.children.length > column) {
      tileContainer.children.forEach((tileArray) => {
        if (tileArray.children) {
          if (tileArray.children[column] instanceof ContainerInstance) {
            const tile = tileArray.children[column] as TileGraphic;
            tileColumn.push(tile);
          }
        }
      });
      return tileColumn;
    }
  };

  const updateTileColor = (tile: TileGraphic, color: string) => {
    if (!tile.correct) {
      tile.clear();
      tile.beginFill(color);
      tile.drawRoundedRect(
        tile.xPosition,
        tile.yPosition,
        tileWidth,
        tileWidth,
        4
      );
      tile.endFill();
    }
  };

  const updateRowAndColumnAlpha = (x: number, y: number, alpha: number) => {
    getColumn(x)?.forEach((tile: TileGraphic) => {
      tile.alpha = alpha;
    });

    getRow(y)?.forEach((tile: TileGraphic) => {
      tile.alpha = alpha;
    });
  };

  const writeNumberInTile = (tile: TileGraphic, number: number) => {
    const text = new Text(number, {
      fontFamily: 'Arial',
      fontSize: Math.floor(tileWidth),
      fill: 0x0000ff,
      align: 'center',
    });
    const x: ContainerInstance = tile as ContainerInstance;
    const centerX = (x.width - text.width) / 2;
    const centerY = (x.height - text.height) / 2;
    text.position.set(tile.xPosition + centerX, tile.yPosition + centerY);
    tile.addChild(text);
  };

  const isCorrect = (tile: TileGraphic) => {
    if (props.currentColor !== props.demoImage[tile.row][tile.column]) {
      return false;
    }
    return true;
  };

  const handlePointerUp = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;

    dragEnd(tile);
    if (clickedTile.row !== -1 && clickedTile.column !== -1) {
    }
    draggedTiles.forEach((tile) => {
      tile.removeChildAt(0);
      if (!isCorrect(tile)) {
        updateTileColor(tile, props.defaultTileColor);
      } else {
        tile.correct = true;
      }
      tile.alpha = 1;
    });
    // draggedTiles = [];
    draggingCoordinate = { row: -1, column: -1 };
  };

  const handleTileClick = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    dragStart(tile);
    clickedTile.row = tile.row;
    clickedTile.column = tile.column;
    draggedTiles.push(tile);
    writeNumberInTile(tile, draggedTiles.length);
    if (isCorrect(tile)) {
      updateTileColor(tile, props.colorMap[props.currentColor]);
    }
  };

  const dragStart = (tile: TileGraphic) => {
    console.log('DRAG:START');
    draggedTiles = [];
    dragging = true;
    draggingCoordinate.row = tile.row;
    draggingCoordinate.column = tile.column;
    drag(tile);
  };

  const dragEnd = (tile: TileGraphic) => {
    console.log('DRAG:END');
    dragging = false;
    draggingCoordinate.row = -1;
    draggingCoordinate.column = -1;
    draggingDirection = undefined;
  };

  const setDragDirection = (tile: TileGraphic) => {
    let newDirection;
    if (tile.row === draggingCoordinate.row) {
      if (tile.column > draggingCoordinate.column) {
        newDirection = 'down';
      } else if (tile.column < draggingCoordinate.column) {
        newDirection = 'up';
      } else {
        newDirection = undefined;
      }
    }

    if (tile.column === draggingCoordinate.column) {
      if (tile.row > draggingCoordinate.row) {
        newDirection = 'right';
      } else if (tile.row < draggingCoordinate.row) {
        newDirection = 'left';
      } else {
        newDirection = undefined;
      }
    }

    if (newDirection === undefined) {
      draggedTiles.forEach((tile: TileGraphic) => {
        updateTileColor(tile, props.defaultTileColor);
      });
    }

    if (newDirection !== draggingDirection) {
      console.log('SWITCH', draggingCoordinate, tile.column);
    }
    draggingDirection = newDirection;
  };

  const drag = (tile: TileGraphic) => {
    setDragDirection(tile);
    const tiles: TileGraphic[] = [];

    if (
      tile.row === draggingCoordinate.row ||
      tile.column === draggingCoordinate.column
    ) {
      switch (draggingDirection) {
        case 'up':
          const upRow = getColumn(draggingCoordinate.row);
          upRow?.forEach((container: ContainerInstance) => {
            const tileGraphic = container.children[0] as TileGraphic;
            if (
              tileGraphic.column <= draggingCoordinate.column &&
              tileGraphic.column >= tile.column
            ) {
              tiles.push(tileGraphic);
            }
          });
          if (tiles.length < draggedTiles.length) {
            draggedTiles.forEach((tileGraphic: TileGraphic) => {
              updateTileColor(tileGraphic, props.defaultTileColor);
            });
          }
          tiles?.forEach((tileGraphic: TileGraphic) => {
            updateTileColor(tileGraphic, props.colorMap[props.currentColor]);
          });
          break;
        case 'down':
          const downRow = getColumn(draggingCoordinate.row);
          downRow?.forEach((container: ContainerInstance) => {
            const tileGraphic = container.children[0] as TileGraphic;
            if (
              tileGraphic.column >= draggingCoordinate.column &&
              tileGraphic.column <= tile.column
            ) {
              tiles.push(tileGraphic);
            }
          });
          if (tiles.length < draggedTiles.length) {
            draggedTiles.forEach((tileGraphic: TileGraphic) => {
              updateTileColor(tileGraphic, props.defaultTileColor);
            });
          }
          tiles?.forEach((tileGraphic: TileGraphic) => {
            updateTileColor(tileGraphic, props.colorMap[props.currentColor]);
          });
          break;
        case 'left':
          const leftColumn = getRow(draggingCoordinate.column);
          leftColumn?.forEach((container: ContainerInstance) => {
            const tileGraphic = container.children[0] as TileGraphic;
            if (
              tileGraphic.row <= draggingCoordinate.row &&
              tileGraphic.row >= tile.row
            ) {
              tiles.push(tileGraphic);
            }
          });
          if (tiles.length < draggedTiles.length) {
            draggedTiles.forEach((tileGraphic: TileGraphic) => {
              updateTileColor(tileGraphic, props.defaultTileColor);
            });
          }
          tiles?.forEach((tileGraphic: TileGraphic) => {
            updateTileColor(tileGraphic, props.colorMap[props.currentColor]);
          });
          break;
        case 'right':
          const rightColumn = getRow(draggingCoordinate.column);
          rightColumn?.forEach((container: ContainerInstance) => {
            const tileGraphic = container.children[0] as TileGraphic;
            if (
              tileGraphic.row >= draggingCoordinate.row &&
              tileGraphic.row <= tile.row
            ) {
              tiles.push(tileGraphic);
            }
          });
          if (tiles.length < draggedTiles.length) {
            draggedTiles.forEach((tileGraphic: TileGraphic) => {
              updateTileColor(tileGraphic, props.defaultTileColor);
            });
          }
          tiles?.forEach((tileGraphic: TileGraphic) => {
            updateTileColor(tileGraphic, props.colorMap[props.currentColor]);
          });
          break;
        default:
          break;
      }
      draggedTiles = tiles;
    }
  };

  const handleTileMouseOver = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    const isDrag = event.data.buttons === 1;
    if (isDrag) {
      if (dragging === false) {
        dragStart(tile);
      } else {
        drag(tile);
      }
    }
    updateRowAndColumnAlpha(tile.row, tile.column, 0.8);
  };

  const handleTileMouseLeave = (event: FederatedPointerEvent) => {
    const tile: TileGraphic = event.currentTarget as TileGraphic;
    const isDrag = event.data.buttons === 1;
    if (isDrag) {
      tile.alpha = 1;
      // draggedTiles.push(tile);
      // writeNumberInTile(tile, draggedTiles.length);
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
