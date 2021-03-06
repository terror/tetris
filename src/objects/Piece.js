import Direction from '../enums/Direction.js';
import PieceFactory from '../services/PieceFactory.js';
import PieceType from '../enums/PieceType.js';
import SpriteManager from '../../lib/SpriteManager.js';
import Vector from '../../lib/Vector.js';
import {
  didSucceedPercentChance,
  getRandomPositiveInteger,
} from '../../lib/RandomNumberHelpers.js';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
} from '../globals.js';

export default class Piece {
  static PIECE_SIZE = 50;
  static X_POS = BOARD_WIDTH / 2 - Piece.PIECE_SIZE;
  static Y_POS = 0;

  /**
   * The `Piece` constrtuctor.
   * @param {Array} matrix - The matrix of the piece.
   * @param {Vector} position - The position of the piece.
   */
  constructor(matrix) {
    // The underlying representation of this piece in memory
    this.matrix = matrix;

    // Position on the canvas
    this.position = new Vector(Piece.X_POS, Piece.Y_POS);

    // Set piece sprites
    this.sprites = SpriteManager.generatePieceSprites();
  }

  /**
   * Get the current board position of the piece on the board.
   */
  get boardPosition() {
    return new Vector(
      this.position.x / Piece.PIECE_SIZE,
      this.position.y / Piece.PIECE_SIZE
    );
  }

  /**
   * Create a new `Piece` based on a previous state.
   * @param {Object} state - The previous state
   */
  static fromState(state) {
    if (state === null) return null;
    const piece = new Piece(state.matrix);
    piece.position = state.position;
    return piece;
  }

  /**
   * Instantiate a random piece.
   */
  static getRandomPiece() {
    // Grab a new random piece using the piece factory
    const piece = PieceFactory.createInstance(
      Object.keys(PieceType)[
        getRandomPositiveInteger(0, Object.keys(PieceType).length - 1)
      ]
    );

    // 20% chance of spawning a power-up
    if (didSucceedPercentChance(0.2)) {
      return new PowerUp(piece.matrix);
    } else {
      return piece;
    }
  }

  /**
   * Move the piece a single step in the given direction.
   * @param {Object} args - Movement arguments.
   */
  move(args) {
    // Grab arguments
    const { state, direction } = args;

    // Handle direction
    switch (direction) {
      case Direction.Up:
        this.position.y -= Piece.PIECE_SIZE;
        this.position.y += Piece.PIECE_SIZE * this.didCollide(state.board);
        break;
      // Down is a special case, we handle placement of the piece on the board
      case Direction.Down:
        this.position.y += Piece.PIECE_SIZE;
        state.handleTick();
        break;
      case Direction.Left:
        this.position.x -= Piece.PIECE_SIZE;
        this.position.x += Piece.PIECE_SIZE * this.didCollide(state.board);
        break;
      case Direction.Right:
        this.position.x += Piece.PIECE_SIZE;
        this.position.x -= Piece.PIECE_SIZE * this.didCollide(state.board);
        break;
    }
  }

  /**
   * Rotate the piece.
   * @param {Board} board - The board to check for collisions.
   * @param {Direction} direction - The direction to rotate the piece.
   */
  rotate(board, direction = Direction.Up) {
    const xPos = this.position.x;
    let offset = 1;

    /**
     * Rotate the pieces matrix.
     */
    const rotateMatrix = (direction) => {
      this.matrix.forEach((row, y) => {
        for (let x = 0; x < y; ++x) {
          [this.matrix[x][y], this.matrix[y][x]] = [
            this.matrix[y][x],
            this.matrix[x][y],
          ];
        }
      });

      if (direction === Direction.Up) {
        this.matrix.forEach((row) => row.reverse());
      } else if (direction === Direction.Down) {
        this.matrix.reverse();
      }
    };

    rotateMatrix(direction);
    while (this.didCollide(board)) {
      this.position.x += offset;
      offset = -(offset + (offset > 0 ? 1 : -1));
      if (offset > this.matrix[0].length) {
        rotateMatrix(
          direction === Direction.Up ? Direction.Down : Direction.Up
        );
        this.position.x = xPos;
        return;
      }
    }
  }

  /**
   * Check if the passed in board has collided with the piece.
   * @param {Piece} piece - Piece to check
   */
  didCollide(board) {
    let didCollide = false;
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (
          value !== 0 &&
          (board.pieces[y + this.boardPosition.y] &&
            board.pieces[y + this.boardPosition.y][
              x + this.boardPosition.x
            ]) !== 0
        ) {
          didCollide = true;
        }
      });
    });
    return didCollide;
  }

  /**
   * Render a single piece on the canvas.
   */
  render(position = null) {
    this.matrix.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value !== 0) {
          this.sprites[value].render(
            (position !== null ? position.x : this.position.x) +
              x * Piece.PIECE_SIZE,
            (position !== null ? position.y : this.position.y) +
              y * Piece.PIECE_SIZE
          );
        }
      });
    });
  }
}

class PowerUp extends Piece {
  constructor(matrix) {
    super(matrix);
    this.sprites = SpriteManager.generateClearPieceSprites();
    this.isPowerUp = true;
  }
}
