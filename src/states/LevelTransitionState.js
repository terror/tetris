import Board from '../objects/Board.js';
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
  stateMachine,
  timer,
} from '../globals.js';
import GameStateName from '../enums/GameStateName.js';

export default class LevelTransitionState extends State {
  constructor() {
    super();

    // Countdown timer until the next level
    this.maxTimer = 10;
    this.timer = this.maxTimer;
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to pass to the state.
   */
  enter(parameters) {
    this.score = parameters.score;
    this.level = parameters.level;

    // Launch the confetti
    // TODO: Get this to display above the interface
    // confetti({
    //   particleCount: 100,
    //   spread: 70,
    //   origin: { y: 0.6 },
    // });

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
        score: this.score,
        level: this.level,
        pieces: new Queue([Piece.getRandomPiece(), Piece.getRandomPiece()]),
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

    context.restore();
  }

  /**
   * Decrement the timer each second.
   */
  startTimer() {
    timer.addTask(() => --this.timer, 1, this.maxTimer);
  }
}
