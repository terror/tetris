import Board from '../objects/Board.js';
import GameStateName from '../enums/GameStateName.js';
import ImageName from '../enums/ImageName.js';
import Piece from '../objects/Piece.js';
import SoundName from '../enums/SoundName.js';
import Queue from '../../lib/Queue.js';
import State from '../../lib/State.js';
import Vector from '../../lib/Vector.js';
import {
  keys,
  stateMachine,
  sounds,
  context,
  images,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  MAX_LEVEL,
  BOARD_WIDTH,
  BOARD_HEIGHT,
} from '../globals.js';

export default class LevelSelectState extends State {
  constructor() {
    super();
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to pass to the state.
   */
  enter(parameters) {
    this.level = 1;
  }

  /**
   * Update the state.
   * @param {Number} dt - The delta time.
   */
  update(dt) {
    // If they hit `Escape`, go back to the `Title` screen.
    if (keys.Escape) {
      keys.Escape = false;
      stateMachine.change(GameStateName.Title);
    }

    // Move on to the `PlayState` when the user presses `Enter`.
    if (keys.Enter) {
      keys.Enter = false;
      stateMachine.change(GameStateName.Play, {
        board: new Board(
          new Vector(0, 0),
          new Vector(
            BOARD_WIDTH / Piece.PIECE_SIZE,
            BOARD_HEIGHT / Piece.PIECE_SIZE
          )
        ),
        score: 0,
        level: this.level,
        pieces: new Queue([Piece.getRandomPiece(), Piece.getRandomPiece()]),
      });
    }

    // Subtract 1 to the level number when the user presses `a`.
    if (keys.a) {
      keys.a = false;
      if (this.level - 1 > 0) {
        sounds.play(SoundName.Bump);
        this.level--;
      }
    }

    // Add 1 from the level number when the user presses `d`.
    if (keys.d) {
      keys.d = false;
      if (this.level + 1 <= MAX_LEVEL) {
        sounds.play(SoundName.Bump);
        this.level++;
      }
    }
  }

  /**
   * Render the states interface.
   */
  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    context.font = '40px Joystix';
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    // Message
    context.fillText(
      'Choose your level',
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.5
    );

    // Draw the level number.
    context.fillText(
      `< ${this.level.toString()} >`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.6
    );

    // Message
    context.fillText(
      'Press Enter to Play',
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.7
    );

    context.restore();
  }
}
