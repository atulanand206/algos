import React from 'react';
import { useRef, useEffect } from 'react';
import './App.css';
import { Draw } from './curves';
import { Boxes } from './Jigsaw/Jigsaw';
import { Slider } from 'material-ui-slider';

const grid = Boxes({ x: 0, y: 0 }, 100, 8, 8)

const draw = (ctx) => {
  Draw(ctx, grid)
}

const getPath = (x, y) => {
  var pat = "polygon("

  if (x < grid.essentials.length && y < grid.essentials[x].length) {
    const face = grid.essentials[x][y].clockwise
    for (var i = 0; i < face.length; i++) {
      pat = pat.concat(face[i].x / 8 + '% ' + face[i].y / 8 + '%')
      if (i !== face.length - 1) pat = pat.concat(', ')
    }
  }
  pat = pat.concat(')')
  return pat
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

  constructor(props) {
    super(props)
    this.state = {
      step: 30,
      visibility: this.vis(8, 8)
    }
  }

  vis(x, y) {
    const v = []
    for (var i = 0; i < x; i++) {
      const row = []
      for (var j = 0; j < y - 2; j++) {
        row.push(true)
      }
      row.push(true)
      row.push(true)
      v.push(row)
    }
    return v
  }

  onSliderChange(value) {
    this.setState({step: value})
    return `${value}°C`;
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <Canvas className='canvas-wrapper' /> */}
          <div className='grid-images'>
            {grid.essentials.map((row, i) => row.map((it, j) => {
              // if ((i === 4 && j === 5) || (i === 1 && j === 3) || (i === 6 && j === 7)) {
              //   return <div className='canvas-image-wrapper' />
              // }
              return <div className='canvas-image-wrapper' 
              style={
                {
                  transform: `translateX(${this.state.step * j}px) translateY(${this.state.step * i}px)`
                }}
              >
                <img
                  className='canvas-image'
                  style={{ clipPath: getPath(i, j)
                    , transform: `translateY(-${100 * (i * grid.essentials.length + j)}px)`,
                    display: (i < this.state.visibility.length && j < this.state.visibility[i].length 
                        && this.state.visibility[i][j]) ? 'block' : 'none'
                  }}
                  src='anne1.jpeg' alt="Public Space"
                  height="100" width="100"
                />
              </div>
            }))}
          </div>
        </header>
        <footer>
          <Slider
            defaultValue={30}
            onChange={(v) => this.onSliderChange(v)}
            aria-labelledby="discrete-slider"
            valueLabelDisplay="auto"
            step={10}
            marks
            min={0}
            max={100}
          />
        </footer>
      </div>
    );
  }
}

export default App;
