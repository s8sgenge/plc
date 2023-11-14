import { BlurFilter } from 'pixi.js';
import {
  Stage,
  Container,
  Sprite,
  Text,
  useApp,
  Graphics,
  useTick,
} from '@pixi/react';
import { FederatedPointerEvent } from '@pixi/events';
import '@pixi/events';
import { useCallback, useMemo } from 'react';

const colorMap = { 0: '#B20C1C', 1: '#2129DF', 2: '#F5DDA3' };
const array = [];
const rows = 50;
const cols = 50;

for (let i = 0; i < rows; i++) {
  const row = [];
  for (let j = 0; j < cols; j++) {
    row.push(0);
  }
  array.push(row);
}

array[0][0] = -1;

export const MyComponent = () => {
  const app = useApp();
  //   const tick = useTick((delta) => console.log(delta));

  const rectWidth = app.view.width / rows - 2;

  const currentColor = 0;

  const draggedGraphics = [];

  const drawRectangle = (graphic, x, y, width, height, color) => {
    graphic.clear(); // Clear existing graphics
    graphic.beginFill(color); // Change the color to green (adjust as needed)
    graphic.drawRect(x, y, width, height);
    graphic.endFill();
  };

  const changeGraphicColor = (graphic, color) => {
    graphic.clear(); // Clear existing graphics
    graphic.beginFill(color); // Change the color to green (adjust as needed)
    graphic.drawRect(graphic.xPos, graphic.yPos, rectWidth, rectWidth);
    graphic.endFill();
  };

  const isCorrect = (graphic) => {
    if (currentColor !== array[graphic.x][graphic.y]) {
      return false;
    }
    return true;
  };

  const handlePointerUp = () => {
    draggedGraphics.forEach((graphic) => {
      graphic.alpha = 1;
    });
  };

  const handleGraphicsClick = (event: FederatedPointerEvent) => {
    if (isCorrect(event.currentTarget)) {
      changeGraphicColor(event.currentTarget, colorMap[0]);
    }
  };

  const handleGraphicsHover = (e: any) => {
    const isDrag = e.data.buttons === 1;
    if (isDrag && isCorrect(e.currentTarget)) {
      changeGraphicColor(e.currentTarget, colorMap[0]);
    }
    e.currentTarget.alpha = 0.8;
  };

  const handleGraphicsHoverEnd = (e: any) => {
    const isDrag = e.data.buttons === 1;
    if (!isDrag) {
      e.currentTarget.alpha = 1;
    } else {
      draggedGraphics.push(e.currentTarget);
    }
  };

  const createGrid = (w: number, h: number) => {
    let xStart = 0;
    let yStart = 0;

    const elements = [];
    for (let x = 0; x < w; x++) {
      for (let y = 0; y < h; y++) {
        elements.push(
          <Graphics
            key={x + w * y}
            interactive={true}
            cursor="pointer"
            pointerdown={handleGraphicsClick}
            pointerover={handleGraphicsHover}
            pointerout={handleGraphicsHoverEnd}
            pointerup={handlePointerUp}
            draw={(g) => {
              drawRectangle(
                g,
                xStart + x * (rectWidth + 1),
                yStart + y * (rectWidth + 1),
                rectWidth,
                rectWidth,
                '#cacaca'
              );
              g.key = x + w * y;
              g.xPos = xStart + x * (rectWidth + 1);
              g.yPos = yStart + y * (rectWidth + 1);
              g.x = x;
              g.y = y;
              return g;
            }}
          />
        );
      }
    }
    return elements;
  };

  return (
    <Container pointerup={handlePointerUp}>{createGrid(rows, cols)}</Container>
  );
};
