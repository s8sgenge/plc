import './App.css';
import { TileGrid } from './TileGrid';
import { Stage } from '@pixi/react';

const ROWS = 50;
const COLUMNS = 50;
const createDemoImage = () => {
  const image: number[][] = [];
  for (let i = 0; i < ROWS; i++) {
    const row = [];
    for (let j = 0; j < COLUMNS; j++) {
      row.push(0);
    }
    image.push(row);
  }
  image[0][0] = 1;
  image[1][0] = 1;
  return image;
};
const COLOR_MAP = { 0: '#B20C1C', 1: '#2129DF', 2: '#F5DDA3' };
const DEMO_IMAGE: number[][] = createDemoImage();
const DEFAULT_TILE_COLOR = '#cacaca';
const currentColor = 0;
function App() {
  return (
    <>
      <Stage width={800} height={800}>
        <TileGrid
          rows={ROWS}
          columns={COLUMNS}
          colorMap={COLOR_MAP}
          demoImage={DEMO_IMAGE}
          defaultTileColor={DEFAULT_TILE_COLOR}
          currentColor={currentColor}
        />
      </Stage>
    </>
  );
}

export default App;
