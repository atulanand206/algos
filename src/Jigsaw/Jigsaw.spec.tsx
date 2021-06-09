import * as chai from 'chai';
import * as Jigsaw from './Jigsaw';
import { log } from './Jigsaw';
import util from 'util';

describe('Edges', () => {
    it('should have a horizontal line', () => {
        // const ex = Jigsaw.HEdge({ x: 100, y: 100 }, 100)
        // chai.expect(ex.natural.points).deep.equal([{ x: 100, y: 100 }, { x: 200, y: 100 }])
        // chai.expect(ex.reverse.points).deep.equal([{ x: 200, y: 100 }, { x: 100, y: 100 }])
    });

    it('should have a vertical line', () => {
        // const ex = Jigsaw.VEdge({ x: 100, y: 100 }, 100)
        // chai.expect(ex.natural.points).deep.equal([{ x: 100, y: 100 }, { x: 100, y: 200 }])
        // chai.expect(ex.reverse.points).deep.equal([{ x: 100, y: 200 }, { x: 100, y: 100 }])
    });

    it('should have a series of edges for the horizontal line', () => {
        // const ex = Jigsaw.HLine({ x: 100, y: 100 }, 100, 10);
        // chai.expect(ex[4].natural).deep.equal({ points: [{ x: 500, y: 100 }, { x: 600, y: 100 }] })
        // chai.expect(ex[7].reverse).deep.equal({ points: [{ x: 900, y: 100 }, { x: 800, y: 100 }] })
    });

    it('should have a series of edges for the vertical line', () => {
        // const ex = Jigsaw.VLine({ x: 100, y: 100 }, 100, 10);
        // chai.expect(ex[3].natural).deep.equal({ points: [{ x: 100, y: 400 }, { x: 100, y: 500 }] })
        // chai.expect(ex[8].reverse).deep.equal({ points: [{ x: 100, y: 1000 }, { x: 100, y: 900 }] })
    });
});

describe('Faces', () => {
    it('should have a face with four edges', () => {
        // console.log(util.inspect(ex, { showHidden: true, depth: 10 }));
    });

    it('should have a grid of size 1x1', () => {
        // const ex = Jigsaw.Boxes({ x: 100, y: 100}, 100, 1, 1)
        // Jigsaw.log(ex.faces[0][0]);
    });

    it('should have a grid of size 2x2', () => {
        // const ex = Jigsaw.Boxes({ x: 100, y: 100}, 100, 2, 2)
        // Jigsaw.log(ex.faces);
    });
});

describe('Points', () => {
    it('should have 15 points inserted at intervals of 25%', () => {
        const ex = Jigsaw.extrapolate({ x: 100, y: 100}, { x: 200, y: 200})
        log(ex)
        chai.expect(ex[8]).deep.equal({ x: 150, y: 150 })
    })
})