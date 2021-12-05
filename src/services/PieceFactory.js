import Piece from '../objects/Piece.js';
import PieceType from '../enums/PieceType';

export default class PieceFactory {
  /**
   * Encapsulates the instantiation of a piece.
   * @param {object} type - The type of piece to instantiate.
   * @returns {Piece} - The instantiated piece.
   */
  static createInstance(type) {
    switch (type) {
      case PieceType.S:
        return new Piece([
          [0, 0, 0],
          [0, 1, 1],
          [1, 1, 0],
        ]);
    }
  }
}
