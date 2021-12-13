import Piece from './Piece.js';
import SoundName from '../enums/SoundName.js';
import SpriteManager from '../../lib/SpriteManager.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, context, sounds } from '../globals.js';

export default class Board {
  /**
   * The `Board` class constructor.
   * @param {Vector} position - Position of the board
   * @param {Vector} dimensions - Dimensions of the board
   */
  constructor(position, dimensions) {
    this.position = position;
    this.dimensions = dimensions;
    this.sprites = SpriteManager.generatePieceSprites();
    this.initializeBoard();
  }

  /**
   * Create a new `Board` based on a previous state.
   * @param {Object} state - Previous board state
   */
  static fromState(state) {
    const board = new Board(state.position, state.dimensions);
    board.pieces = state.pieces;
    return board;
  }

  /**
   * Initialize a new pieces array.
   */
  initializeBoard() {
    this.pieces = [];
    for (let i = 0; i < this.dimensions.y; ++i) {
      this.pieces.push(new Array(this.dimensions.x).fill(0));
    }
  }

  /**
   * Add a piece to the board.
   * @param {Piece} piece - Piece to add
   */
  add(piece) {
    piece.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.pieces[y + piece.boardPosition.y][
            x + piece.boardPosition.x
          ] = value;
        }
      });
    });
  }

  /**
   * Clear full lines on the board.
   * @returns {Number} - Number of lines cleared
   */
  sweep() {
    let cleared = 0;
    for (let y = this.pieces.length - 1; y >= 0; y--) {
      if (!this.pieces[y].some((value, x) => value === 0)) {
        sounds.play(SoundName.Clear);
        this.pieces.unshift(this.pieces.splice(y, 1)[0].fill(0));
        ++cleared;
      }
    }
    return cleared;
  }

  /**
   * Render the board on the canvas.
   */
  render() {
    this.renderBorder();
    this.renderPieces();
  }

  /**
   * Render border around the board.
   */
  renderBorder() {
    // Draw the border
    context.strokeStyle = '#FFFFFF';
    context.strokeRect(
      this.position.x,
      this.position.y,
      this.dimensions.x * Piece.PIECE_SIZE,
      this.dimensions.y * Piece.PIECE_SIZE
    );
  }

  /**
   * Render the pieces on the board.
   */
  renderPieces() {
    // Render all pieces
    this.pieces.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.sprites[value].render(
            x * Piece.PIECE_SIZE,
            y * Piece.PIECE_SIZE
          );
        }
      });
    });
  }
}
