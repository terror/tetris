import Piece from '../objects/Piece.js';
import PieceType from '../enums/PieceType.js';
import Vector from '../../lib/Vector.js';

export default class PieceFactory {
  /**
   * Encapsulates the instantiation of a piece.
   * @param {String} type - The type of piece to instantiate
   * @param {Vector} position - The position of the piece
   * @returns {Piece} - The instantiated piece
   */
  static createInstance(type) {
    switch (type) {
      case PieceType.S:
        return new Piece([
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0],
        ]);
      case PieceType.Z:
        return new Piece([
          [0, 0, 0],
          [4, 4, 0],
          [0, 4, 4],
        ]);
      case PieceType.I:
        return new Piece([
          [0, 2, 0, 0],
          [0, 2, 0, 0],
          [0, 2, 0, 0],
          [0, 2, 0, 0],
        ]);
      case PieceType.L:
        return new Piece([
          [0, 5, 0],
          [0, 5, 0],
          [0, 5, 5],
        ]);
      case PieceType.J:
        return new Piece([
          [0, 6, 0],
          [0, 6, 0],
          [6, 6, 0],
        ]);
      case PieceType.T:
        return new Piece([
          [0, 0, 0],
          [7, 7, 7],
          [0, 7, 0],
        ]);
      case PieceType.O:
        return new Piece([
          [1, 1],
          [1, 1],
        ]);
    }
  }
}
