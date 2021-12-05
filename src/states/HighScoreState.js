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

export default class HighScoreState extends State {
  constructor() {
    super();
  }

  enter(parameters) {
    this.highScores = HighScoreManager.loadHighScores();
  }

  update(dt) {
    if (keys.Escape) {
      keys.Escape = false;
      stateMachine.change(GameStateName.Title);
    }
  }

  /**
   * NOTE: Adapted from breakout: assignment #2
   */
  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    context.fillStyle = 'white';
    context.font = '40px Joystix';
    context.textAlign = 'center';

    // High scores message
    context.fillText(
      `🎉 HIGH SCORES 🎉`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.15
    );

    // Render all high scores
    for (let i = 1; i <= 10; i++) {
      const name = this.highScores[i - 1].name ?? '---';
      const score = this.highScores[i - 1].score ?? '---';

      context.textAlign = 'left';
      context.fillText(
        `${i}.`,
        CANVAS_WIDTH * 0.25,
        CANVAS_HEIGHT * 0.2 + i * 50
      );
      context.textAlign = 'center';
      context.fillText(
        `${name}`,
        CANVAS_WIDTH * 0.5,
        CANVAS_HEIGHT * 0.2 + i * 50
      );
      context.textAlign = 'right';
      context.fillText(
        `${score}`,
        CANVAS_WIDTH * 0.75,
        CANVAS_HEIGHT * 0.2 + i * 50
      );
    }

    // Back to title message
    context.font = '20px Joystix';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(
      `Press Escape to return to the main menu!`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.97
    );

    context.restore();
  }
}
