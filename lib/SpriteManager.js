import ImageName from '../src/enums/ImageName.js';
import { images, TILE_SIZE } from '../src/globals.js';
import Sprite from './Sprite.js';

export default class SpriteManager {
  /**
   * Retrives all piece sprites from the sprite sheet.
   * @returns {Array} An array of all the piece sprites
   */
  static generatePieceSprites() {
    const x = 50;
    let y = TILE_SIZE;
    const sprites = [];

    for (let i = 0; i < 8; ++i) {
      sprites.push(
        new Sprite(images.get(ImageName.Pieces), x, y, TILE_SIZE, TILE_SIZE)
      );
      y += TILE_SIZE;
    }

    return sprites;
  }
}
