import GameStateName from '../enums/GameStateName.js';
import HighScoreManager from '../../lib/HighScoreManager.js';
import ImageName from '../enums/ImageName.js';
import State from '../../lib/State.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  images,
  keys,
  stateMachine,
} from '../globals.js';

/**
 * Note: Adapted from Breakout: Assignment #2
 */
export default class HighScoreState extends State {
  constructor() {
    super();
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to use when creating the state.
   */
  enter(parameters) {
    this.highScores = HighScoreManager.loadHighScores();
  }

  /**
   * Update the state.
   * @param {Number} dt - The time delta between ticks.
   */
  update(dt) {
    if (keys.Escape) {
      keys.Escape = false;
      stateMachine.change(GameStateName.Title);
    }
  }

  /**
   * Note: Adapted from Breakout: Assignment #2
   */
  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    context.fillStyle = 'white';
    context.font = '40px Joystix';
    context.textAlign = 'center';

    context.fillText(
      `🎉 HIGH SCORES 🎉`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.1
    );

    for (let i = 1; i <= 10; i++) {
      const name = this.highScores[i - 1].name ?? '---';
      const score = this.highScores[i - 1].score ?? '---';

      context.textAlign = 'left';
      context.fillText(
        `${i}.`,
        CANVAS_WIDTH * 0.25,
        CANVAS_HEIGHT * 0.15 + i * 50
      );
      context.textAlign = 'center';
      context.fillText(
        `${name}`,
        CANVAS_WIDTH * 0.5,
        CANVAS_HEIGHT * 0.15 + i * 50
      );
      context.textAlign = 'right';
      context.fillText(
        `${score}`,
        CANVAS_WIDTH * 0.75,
        CANVAS_HEIGHT * 0.15 + i * 50
      );
    }

    context.font = '20px Joystix';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(
      `Press Escape to return to the main menu!`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.95
    );

    context.restore();
  }
}
