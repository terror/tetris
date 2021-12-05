export default class Player {
  /**
   * The `Player` class constructor.
   * @param {number} x
   * @param {number} y
   * @param {Piece} piece
   */
  constructor(x, y, piece) {
    this.x = x;
    this.y = y;
    this.piece = piece;
  }
}
