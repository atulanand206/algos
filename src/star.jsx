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
