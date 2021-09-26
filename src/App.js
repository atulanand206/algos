import React, { useRef, useEffect } from 'react';
import './App.css';
import { Draw, rows, cols } from './curves';
import { Boxes } from './Jigsaw/Jigsaw';
import { renderList } from './Faces/Face'
import { vis, pos, spiralPrint } from './utils/_helpers'
import { TSvg } from './Svg/TSvg';

const grid = Boxes({ x: 0, y: 0 }, 800 / cols, rows, cols)

const visi = vis(cols, rows)

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

var len = grid.faces.length
var total = len > 0 ? len * grid.faces[0].length : 0
const pieces = []
for (var i = 0; i < total; i++) {
  var cd = pos(i, len)
  pieces.push({
    x: cd[0],
    y: cd[1]
  })
}

class App extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      visibility: visi
    }
  }

  componentDidMount() {
    this.spiral()
  }

  rowwise = async () => {
    for (var k = 0; k < total; k++) {
      var cd = pos(k, len)
      const vi = this.state.visibility
      vi[cd[0]][cd[1]] = true
      this.setState({ visibility: vi })
      await new Promise(r => setTimeout(r, 200));
    }
  }

  spiral = async () => {
    const series = spiralPrint(grid.essentials.length, grid.essentials[0].length)
    for (var l = 0; l < series.length; l++) {
      const vi = this.state.visibility
      vi[series[l][0]][series[l][1]] = true
      this.setState({ visibility: vi })
      await new Promise(r => setTimeout(r, 200))
    }
  }

  cellItem = ({ x, y }) => {
    return renderList(grid, x, y, true)
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          {/* <div className='recycled-images'> */}
          {/* <RecycledList itemFn={cellItem} attrList={pieces} itemHeight={100} /> */}
          {/* </div> */}
          <Canvas className='canvas-wrapper' />
          <div className='grid-images'>
            {/* {Faces(grid, this.state.visibility)} */}
            <TSvg />
          </div>
        </header>
      </div>
    );
  }
}

export default App