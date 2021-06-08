import  { useRef, useEffect } from 'react';
import './App.css';
import { Draw, drawCurves, line } from './curves';

const drawStar = (cx) => {
  function pointAt(center, radius, angle) {
    const sinAngle = Math.sin(angle)
    const cosAngle = Math.cos(angle)
    return [center[0] + cosAngle * radius, center[1] + sinAngle * radius]
  }

  var center = [200, 200]
  var rad = 100
  var start = pointAt(center, rad, 0)
  cx.beginPath();
  cx.moveTo(start[0], start[1])
  for (var i = 1; i <= 8; i++) {
    var point = pointAt(center, rad, i * Math.PI / 4)
    cx.quadraticCurveTo(center[0], center[1], point[0], point[1])
  }
  cx.moveTo(start[0], start[1])
  cx.fillStyle = "#FF8C00"
  cx.fill()
  cx.fillStyle = "transparent"
}

const drawZigZag = (cx) => {
  function nextPoint(point) {
    if (point[0] === 10) return [100, point[1] + 8]
    else return [10, point[1] + 8]
  }
  var start = [10, 10]
  cx.beginPath();
  cx.moveTo(start[0], start[1])
  for (var i = 0; i < 12; i++) {
    start = nextPoint(start)
    cx.lineTo(start[0], start[1])
    cx.strokeStyle = "#000";
    cx.stroke()
  }
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
    // drawCurves(context)
    // line(context)
    Draw(context)
    // drawZigZag(context)
    // drawStar(context)
  }, [])

  return <canvas ref={canvasRef} {...props}/>
}

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Canvas className='canvas-wrapper'/>
      </header>
    </div>
  );
}

export default App;
