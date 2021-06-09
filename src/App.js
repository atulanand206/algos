import React from 'react';
import { useRef, useEffect } from 'react';
import './App.css';
import { Draw } from './curves';
import { Boxes } from './Jigsaw/Jigsaw';

const grid = Boxes({ x: 0, y: 0 }, 100, 8, 8)

const draw = (ctx) => {
  Draw(ctx, grid)
}

const Canvas = props => {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const size = 800;
    var scale = window.devicePixelRatio; // Change to 1 on retina screens to see blurry canvas.
    canvas.width = size * scale;
    canvas.height = size * scale;
    context.scale(scale, scale);

    draw(context)
  }, [])

  return <canvas ref={canvasRef} {...props} />
}

class App extends React.Component {

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Canvas className='canvas-wrapper' />
          <img className='canvas-image' src='anne1.jpeg' alt="Public Space" height="800" width="800" />
        </header>
      </div>
    );
  }
}

export default App;
