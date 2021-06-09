import util from 'util';

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
}

export function Boxes(start: Point, length: number, rows: number, cols: number): Grid {
    const horizontal = []
    for (var i = 0; i <= cols; i++) {
        if (i == 0 || i == cols) {
            horizontal.push(HLine(offset(start, 0, length * i), length, cols)) 
        } else {
            horizontal.push(ZLine(offset(start, 0, length * i), length, cols))
        }
    }

    const vertical = []
    for (i = 0; i <= rows; i++) {
        vertical.push(VLine(offset(start, length * i, 0), length, cols))
    }

    const faces = []
    for (i = 0; i < cols; i++) {
        const row = []
        for (var j = 0; j < rows; j++) {
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
        clockwise: 
            horizontal[i][j].natural.points
            .concat(vertical[j + 1][i].natural.points)
            .concat(horizontal[i + 1][j].reverse.points)
            .concat(vertical[j][i].reverse.points)
            .concat(horizontal[i][j].natural.points)
        
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

export function ZEdge(start: Point, length: number): Edge {
    const end = offset(start, length, 0)
    const mid = offset(start, length / 2, length / 10)
    return { natural: { points: [start, mid, end] }, reverse: { points: [end, mid, start] } }
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