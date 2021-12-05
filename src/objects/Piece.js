import { context } from '../globals.js';

export default class Piece {
  /**
   * The `Piece` constrtuctor.
   * @param {*} x - The x position of the piece
   * @param {*} y - The y position of the piece
   * @param {*} matrix - The matrix of the piece
   */
  constructor(x, y, matrix) {
    this.x = x;
    this.y = y;
    this.matrix = matrix;
  }

  /**
   * Render a single piece on the canvas.
   */
  render() {
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = 'blue';
          context.fillRect(this.x, this.y, 1, 1);
        }
      });
    });
  }
}
