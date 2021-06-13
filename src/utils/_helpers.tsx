import { Grid } from './../Jigsaw/Jigsaw'

export const getPath = (grid: Grid, x: number, y: number) => {
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

export const vis = (x: number, y: number) => {
	const v = []
	for (var i = 0; i < x; i++) {
		const row = []
		for (var j = 0; j < y - 2; j++) {
			row.push(false)
		}
		row.push(false)
		row.push(false)
		v.push(row)
	}
	return v
}

export const pos = (x: number, len: number) => {
	// console.log('pos', x, len, Math.floor(x / len), x % len)
	return [Math.floor(x / len), x % len]
}

export const spiralPrint = (m: number, n: number) => {
	var i, k = 0, l = 0;
	const ans = []


	while (k < m && l < n) {
		for (i = l; i < n; ++i) {
			ans.push([k, i])
		}
		k++;

		for (i = k; i < m; ++i) {
			ans.push([i, n - 1])
		}
		n--;

		if (k < m) {
			for (i = n - 1; i >= l; --i) {
				ans.push([m - 1, i])
			}
			m--;
		}

		if (l < n) {
			for (i = m - 1; i >= k; --i) {
				ans.push([i, l])
			}
			l++;
		}
	}
	return ans
}
