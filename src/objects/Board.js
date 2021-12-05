import { context } from '../globals.js';

export default class Board {
  /**
   * The `Board` class constructor.
   * @param {*} x - x coordinate
   * @param {*} y - y coordinate
   * @param {*} width - width of the board
   * @param {*} height - height of the board
   */
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.pieces = [];
  }

  /**
   * A small wrapper around `renderBoard`.
   */
  render() {
    this.renderBoard();
  }

  /**
   * Render the board on the canvas.
   */
  renderBoard() {
    this.pieces.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          context.fillStyle = 'blue';
          context.fillRect(this.x, this.y, 1, 1);
        }
      });
    });
  }

  /**
   * Initialize a new pieces array.
   */
  initializeBoard() {
    this.pieces = [];
    while (this.height--) {
      this.pieces.push(new Array(this.width).fill(0));
    }
  }
}
