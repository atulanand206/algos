import util from 'util';
import _ from 'lodash';

export function log(object: any) {
    console.log(util.inspect(object, { showHidden: true, depth: 10 }))
}

export interface Point {
    x: number;
    y: number;
}

export interface Path {
    points: Point[];
}

export interface Edge {
    natural: Path;
    reverse: Path;
}

export interface Face {
    clockwise: Point[];
}

export interface Grid {
    horizontal: Edge[][];
    vertical: Edge[][];
    faces: Face[][];
    essentials: Face[][];
}

export function Boxes(start: Point, length: number, rows: number, cols: number): Grid {
    const horizontal = []
    for (var i = 0; i <= rows; i++) {
        if (i === 0 || i === rows) {
            horizontal.push(HLine(offset(start, 0, length * i), length, cols))
        } else {
            const row = []
            for (var j = 0; j <= cols; j++) {
                if (j % 2 === 0) {
                    row.push(HBEdge(offset(start, length * j, length * i), length))
                } else {
                    const edge = HTEdge(offset(start, length * j, length * i), length)
                    
                    row.push(edge)
                }
            }
            horizontal.push(row)
        }
    }

    const vertical = []
    for (i = 0; i <= cols; i++) {
        if (i > 0 && i < cols) {
            vertical.push(VCLine(offset(start, length * i, 0), length, rows))
        } else {
            vertical.push(VLine(offset(start, length * i, 0), length, rows))
        }
    }

    const essentials = []
    for (i = 0; i < rows; i++) {
        const row = []
        for (j = 0; j < cols; j++) {
            row.push(SquareFace(horizontal, vertical, i, j))
        }
        essentials.push(row)
    }

    const faces = []
    for (i = 0; i < rows; i++) {
        const row = []
        for (j = 0; j < cols; j++) {
            row.push(ExtrapolatedFace(essentials[i][j].clockwise))
        }
        faces.push(row)
    }

    return {
        horizontal: horizontal,
        vertical: vertical,
        essentials: essentials,
        faces: faces
    }
}

export function ExtrapolatedFace(line: Point[]): Face {
    var pnts: Point[] = []
    for (var k = 0; k < line.length - 1; k++) {
        pnts = pnts.concat(extrapolate(line[k], line[k+1]))
    }
    return { clockwise: pnts }
}

export function SquareFace(horizontal: Edge[][], vertical: Edge[][], i: number, j: number): Face {
    return {
        clockwise: 
            horizontal[i][j].natural.points
            .concat(vertical[j + 1][i].natural.points)
            .concat(horizontal[i + 1][j].reverse.points)
            .concat(vertical[j][i].reverse.points)
            .concat(horizontal[i][j].natural.points[0])
        
    }
}

export function ZLine(start: Point, length: number, steps: number): Edge[] {
    const edges = []
    for (var i = 0; i < steps; i++) {
        edges.push(ZEdge(offset(start, length * i, 0), length))
    }
    return edges
}

export function HLine(start: Point, length: number, steps: number): Edge[] {
    const edges = []
    for (var i = 0; i < steps; i++) {
        edges.push(HEdge(offset(start, length * i, 0), length))
    }
    return edges
}

export function VLine(start: Point, length: number, steps: number): Edge[] {
    const edges = []
    for (var i = 0; i < steps; i++) {
        edges.push(VEdge(offset(start, 0, length * i), length))
    }
    return edges
}

export function VCLine(start: Point, length: number, steps: number): Edge[] {
    const edges = []
    for (var i = 0; i < steps; i++) {
        if (i % 2 === 0) {
            edges.push(VREdge(offset(start, 0, length * i), length))
        } else {
            edges.push(VLEdge(offset(start, 0, length * i), length))
        }
    }
    return edges
}

export function ZEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    const mid = offset(start, length / 2, length / 10)
    return { natural: { points: [start, mid, end] }, reverse: { points: [end, mid, start] } }
}

export function HBEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    const a = offset(start, length * 0.4, 0)
    const b = offset(start, length * 0.3, -length * 0.2)
    const c = offset(start, length * 0.7, -length * 0.2)
    const d = offset(start, length * 0.6, 0)
    return { natural: { points: [start, a, b, c, d, end] }, reverse: { points: [end, d, c, b, a, start] } }
}

export function HTEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    const a = offset(start, length * 0.4, 0)
    const b = offset(start, length * 0.3, length * 0.2)
    const c = offset(start, length * 0.7, length * 0.2)
    const d = offset(start, length * 0.6, 0)
    return { natural: { points: [start, a, b, c, d, end] }, reverse: { points: [end, d, c, b, a, start] } }
}

export function HEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    return { natural: { points: [start, end] }, reverse: { points: [end, start] } }
}

export function VLEdge(start: Point, length: number): Edge {
    const end = offset(start, 0, length)
    const a = offset(start, 0, length * 0.4)
    const b = offset(start, -length * 0.2, length * 0.3)
    const c = offset(start, -length * 0.2, length * 0.7)
    const d = offset(start, 0, length * 0.6)
    return { natural: { points: [start, a, b, c, d, end] }, reverse: { points: [end, d, c, b, a, start] } }
}

export function VREdge(start: Point, length: number): Edge {
    const end = offset(start, 0, length)
    const a = offset(start, 0, length * 0.4)
    const b = offset(start, length * 0.2, length * 0.3)
    const c = offset(start, length * 0.2, length * 0.7)
    const d = offset(start, 0, length * 0.6)
    return { natural: { points: [start, a, b, c, d, end] }, reverse: { points: [end, d, c, b, a, start] } }
}

export function VEdge(start: Point, length: number): Edge {
    const end = offset(start, 0, length)
    return IEdge([start, end])
}

export function IEdge(pts: Point[]): Edge {
    return { natural: { points: pts }, reverse: { points: _.reverse(pts) } }
}

export function offsetA(pts: Point[], x: number, y: number): Point[] {
    return pts.map(point => offset(point, x, y))
}

export function offset(pt: Point, x: number, y: number): Point {
    return { x: pt.x + x, y: pt.y + y }
}

export function extrapolate(start: Point, end: Point): Point[] {
    const arr = [start, end]
    for (var i = 0; i < 7; i++) {
        var iterations = Math.pow(2, i)
        for (var j = 0; j < iterations; j++) {
            arr.splice(j * 2 + 1, 0, mid(arr[j * 2], arr[j * 2 + 1]))
        }
    }
    return arr
}

export function mid(start: Point, end: Point): Point {
    return { x: (start.x + end.x) / 2, y: (start.y + end.y) / 2}
}