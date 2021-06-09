import { Boxes, offsetA, log, extrapolate } from './Jigsaw/Jigsaw';

export async function Draw(ctx) {
    const grid = Boxes({x: 100, y: 100}, 100, 5, 5)
    var pts = []
    var i, j
    for (i = 0; i < 5; i++) {
        for (j = 0; j < 5; j++) {
            pts.push(offsetA(grid.faces[i][j].clockwise, j * 50 - 50 , i * 50 - 50))
        }
    }
    pts.forEach(pnts => {
        drawPoints(ctx, pnts)
    })

    for (i = 0; i < pts.length; i++) {
        for (j = 0; j < pts[i].length; j++) {
            drawPoint(ctx, pts[i][j], j % 2 == 0 ? '#FF5733' : '#fff')
            await new Promise(r => setTimeout(r, 0.02));
        }
        await new Promise(r => setTimeout(r, 5));
    }
}

function drawPoint(ctx, point, color) {
    if (point.x < 0 || point.y < 0 || point.x > ctx.canvas.width || point.y > ctx.canvas.height) return
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
}

export function drawPoints(ctx, points) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++)
        ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = "#000"
    ctx.stroke()
    ctx.strokeStyle = "transparent"
    ctx.closePath();
}

var percentPts;
export function drawCurves(ctx) {
    ctx.beginPath();
    percentPts = []
    for (var i = -1; i < 8; i++) {
        const pts = getPoints({ x: 0, y: 100 + i * 100 }, 8, ptHor, controlHor)
        drawCurve(ctx, pts)
        percentPts = percentPts.concat(percentPoints(pts))
    }
    for (var j = -1; j < 8; j++) {
        const pts = getPoints({ x: 100 + j * 100, y: 0 }, 8, ptVer, controlVer)
        drawCurve(ctx, pts)
        percentPts = percentPts.concat(percentPoints(pts))
    }
    console.log(percentPts)
    var k = 0;
    const f = setInterval(() => {
        if (k === percentPts.length - 1) clearInterval(f)
        // drawPoint(ctx, percentPts[k++])
    }, 2)
}

function drawCurve(ctx, values) {
    const points = values[0]
    const controlPoints = values[1]
    ctx.moveTo(points[0].x, points[0].y);
    for (var i = 1; i < points.length; i++) {
        const point = points[i]
        const control = controlPoints[i]
        ctx.quadraticCurveTo(control.x, control.y, point.x, point.y)
        ctx.strokeStyle = "#000"
        ctx.stroke()
    }
}

function percentPoints(points) {
    const pts = []
    for (var j = 1; j < points[0].length; j++)
        for (var k = 0; k <= 1; k += 0.01)
            pts.push(getQuadraticBezierXYatPercent(points[0][j - 1], points[1][j], points[0][j], k));
    return pts
}

function getPoints(start, count, pointFunc, controlFunc) {
    var pt = start
    const arr = []
    const mArr = [[0, 0]]
    for (var i = 0; i < count; i++) {
        const last = pt;
        arr.push(pt)
        pt = pointFunc(pt)
        const mid = controlFunc(pt, last, i)
        mArr.push(mid)
    }
    arr.push(pt)
    return [arr, mArr]
}

function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x
    var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y
    return { x: x, y: y }
}

function ptHor(pt) {
    return { x: pt.x + 100, y: pt.y }
}

function ptVer(pt) {
    return { x: pt.x, y: pt.y + 100 }
}

function controlHor(pt, last, i) {
    return { x: (pt.x + last.x) / 2, y: pt.y + ((i % 2 === 0) ? 1 : -1) * 50 };
}

function controlVer(pt, last, i) {
    return { x: pt.x + ((i % 2 === 0) ? 1 : -1) * 50, y: (pt.y + last.y) / 2 }
}