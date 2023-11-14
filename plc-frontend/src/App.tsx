import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';
import { MyComponent } from './MyComponent';
import { Stage } from '@pixi/react';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Stage width={800} height={800}>
        <MyComponent />
      </Stage>
    </>
  );
}

export default App;
