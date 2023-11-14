import './App.css';
import { MyComponent } from './MyComponent';
import { Stage } from '@pixi/react';

function App() {
  return (
    <>
      <Stage width={800} height={800}>
        <MyComponent />
      </Stage>
    </>
  );
}

export default App;
