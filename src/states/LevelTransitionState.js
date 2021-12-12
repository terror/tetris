import Board from '../objects/Board.js';
import GameStateName from '../enums/GameStateName.js';
import ImageName from '../enums/ImageName.js';
import Piece from '../objects/Piece.js';
import Queue from '../../lib/Queue.js';
import State from '../../lib/State.js';
import Vector from '../../lib/Vector.js';
import {
  BOARD_HEIGHT,
  BOARD_WIDTH,
  canvas,
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  images,
  PIECES,
  stateMachine,
  timer,
} from '../globals.js';

export default class LevelTransitionState extends State {
  constructor() {
    super();

    // Countdown timer until the next level
    this.maxTimer = 10;
    this.timer = this.maxTimer;

    // The transition alpha
    this.transitionAlpha = 1;
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to pass to the state.
   */
  async enter(parameters) {
    this.cleared = parameters.cleared;
    this.level = parameters.level;
    this.score = parameters.score;

    // Reset the timer
    this.timer = this.maxTimer;

    // Fade in
    this.transitionAlpha = 1;
    await timer.tweenAsync(this, ['transitionAlpha'], [0], 1);

    // Begin the transition timer
    this.startTimer();
  }

  /**
   * Update the state.
   * @param {Number} dt - The delta time.
   */
  update(dt) {
    timer.update(dt);
    if (this.timer <= 0) {
      stateMachine.change(GameStateName.Play, {
        board: new Board(
          new Vector(0, 0),
          new Vector(
            BOARD_WIDTH / Piece.PIECE_SIZE,
            BOARD_HEIGHT / Piece.PIECE_SIZE
          )
        ),
        cleared: this.cleared,
        score: this.score,
        level: this.level,
        pieces: new Queue(
          new Array(PIECES).fill(null).map(() => Piece.getRandomPiece())
        ),
      });
    }
  }

  /**
   * Render the states interface.
   */
  render() {
    // Render the background
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    this.renderForeground();
    this.renderTimer();

    context.restore();
  }

  renderForeground() {
    context.fillStyle = `rgb(255, 255, 255, ${this.transitionAlpha})`;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.restore();
  }

  renderTimer() {
    context.font = '40px Joystix';
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    context.fillText(`Great job!`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);

    // Decrease the font size
    context.font = '20px Joystix';

    // Message
    context.fillText(
      `You beat level ${this.level - 1} with a score of ${this.score}!`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.56
    );

    context.fillText(
      `Transitioning to level ${this.level} in ${this.timer} second(s)...`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.6
    );
  }

  /**
   * Decrement the timer each second.
   */
  startTimer() {
    timer.addTask(() => --this.timer, 1, this.maxTimer);
  }
}
