import { useRef, useEffect, useState } from 'react';
import RecycledList from "react-recycled-scrolling";
import './App.css';
import { Draw, rows, cols } from './curves';
import { Boxes } from './Jigsaw/Jigsaw';
import { Faces, renderList } from './Faces/Face'
import { vis, pos, spiralPrint } from './utils/_helpers'

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

export default function App() {

  const [visibility, setVisibility] = useState(visi)

  useEffect(() => {
    rowwise()
  })

  const rowwise = async () => {
    for (var k = 0; k < total; k++) {
      var cd = pos(k, len)
      const vi = visibility
      vi[cd[0]][cd[1]] = true
      setVisibility(vi)
      console.log(vi)
      await new Promise(r => setTimeout(r, 200));
    }
  }

  const spiral = () => {
    // console.log(visibility)

    const series = spiralPrint(grid.essentials.length, grid.essentials[0].length)
    for (var l = 0; l < series.length; l++) {
      const vi = visibility
      vi[series[l][0]][series[l][1]] = true
      setVisibility(vi)
      // await new Promise(r => setTimeout(r, 200))
    }
  }

  const cellItem = ({ x, y }) => {
    return renderList(grid, x, y, true)
  }


  return (
    <div className="App">
      <header className="App-header">
        {/* <div className='recycled-images'> */}
          {/* <RecycledList itemFn={cellItem} attrList={pieces} itemHeight={100} /> */}
        {/* </div> */}
        <Canvas className='canvas-wrapper' />
        <div className='grid-images'>
          {Faces(grid, visibility)}
        </div>
      </header>
    </div>
  );
}
