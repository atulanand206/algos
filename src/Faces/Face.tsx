import { Point, Grid } from './../Jigsaw/Jigsaw';
import Block from './../Block/Block'
import { getPath } from './../utils/_helpers'

export const offsetX = (i: number) => {
	return [0, 29, 59, 88, 117, 146, 176, 206][i]
}

export const offsetY = (i: number) => {
	return [0, 5, 10, 16, 25, 32, 38, 44][i]
}

export const FaceAbsolute = (grid: Grid, start: Point, i: number, j: number, visibility: boolean) => {
	const path = getPath(grid, i, j)
	const translateXWrapper = -start.x + (offsetX(j) || 0)
	const translateYWrapper = -start.y + (offsetY(i) || 0)
	const translateY = 100 * (i * grid.essentials.length + j)
	return <Block start={start} path={path}
		translateXWrapper={translateXWrapper} translateYWrapper={translateYWrapper}
		translateYImage={translateY} visibility={visibility}
	/>
}

export const Face = (grid: Grid, start: Point, i: number, j: number, visibility: boolean) => {
	const path = getPath(grid, i, j)
	const translateY = 100 * (i * grid.essentials.length + j)
	return <Block start={start} path={path}
		translateXWrapper={0} translateYWrapper={0}
		translateYImage={translateY} visibility={visibility}
	/>
}

export const Faces = (grid: Grid, visibility: boolean[][]) => {
	return grid.essentials.map((row, i) => row.map((it, j) =>
		Face(grid, it.clockwise[0], i, j, (i < visibility.length && j < visibility[i].length && visibility[i][j]))))
}
