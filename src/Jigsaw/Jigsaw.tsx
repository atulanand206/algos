import util from 'util';
import { drawPoints } from '../curves';

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
    top: Edge;
    left: Edge;
    bottom: Edge;
    right: Edge;
    clockwise: Path[];
}

export interface Grid {
    horizontal: Edge[][];
    vertical: Edge[][];
    faces: Face[][];
}

export function Boxes(start: Point, length: number, rows: number, cols: number): Grid {
    const horizontal = []
    for (var i = 0; i <= cols; i++) {
        horizontal.push(HLine(offset(start, 0, length * i), length, cols))
    }

    const vertical = []
    for (var i = 0; i <= rows; i++) {
        vertical.push(VLine(offset(start, length * i, 0), length, cols))
    }

    const faces = []
    for (var i = 0; i < rows; i++) {
        const row = []
        for (var j = 0; j < cols; j++) {
            row.push(SquareFace(horizontal, vertical, i, j))
        }
        faces.push(row)
    }

    return {
        horizontal: horizontal,
        vertical: vertical,
        faces: faces
    }
}

export function SquareFace(horizontal: Edge[][], vertical: Edge[][], i: number, j: number): Face {
    return {
        top: horizontal[i][j],
        right: vertical[i + 1][j],
        bottom: horizontal[1][j],
        left: vertical[i][j],
        clockwise: [
            horizontal[i][j].natural,
            vertical[i + 1][j].natural,
            horizontal[i + 1][j].reverse,
            vertical[i][j].reverse
        ]
    }
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

export function HEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    return { natural: { points: [start, end] }, reverse: { points: [end, start] } }
}

export function VEdge(start: Point, length: number): Edge {
    const end = offset(start, 0, length)
    return { natural: { points: [start, end] }, reverse: { points: [end, start] } }
}

export function offset(pt: Point, x: number, y: number): Point {
    return { x: pt.x + x, y: pt.y + y }
}