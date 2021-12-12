import GameStateName from '../enums/GameStateName.js';
import ImageName from '../enums/ImageName.js';
import SoundName from '../enums/SoundName.js';
import State from '../../lib/State.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  images,
  keys,
  sounds,
  stateMachine,
  timer,
} from '../globals.js';

export default class GameOverState extends State {
  constructor() {
    super();

    this.menuOptions = {
      enterHighScore: 'Enter High Score',
    };

    this.highlighted = this.menuOptions.enterHighScore;

    // The transition alpha
    this.transitionAlpha = 1;
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to pass to the state
   */
  async enter(parameters) {
    this.level = parameters.level;
    this.score = parameters.score;

    // Fade in
    this.transitionAlpha = 1;
    await timer.tweenAsync(this, ['transitionAlpha'], [0], 1);
  }

  /**
   * Handle user input.
   * @param {Number} dt - The time delta
   */
  update(dt) {
    timer.update(dt);
    if (keys.Enter) {
      keys.Enter = false;
      sounds.play(SoundName.Bump);
      if (this.highlighted === this.menuOptions.enterHighScore) {
        stateMachine.change(GameStateName.EnterHighScore, {
          score: this.score,
        });
      }
    }
  }

  /**
   * Render the state interface.
   */
  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    this.renderForeground();
    this.renderInterface();

    context.restore();
  }

  /**
   * Render text and options.
   */
  renderInterface() {
    context.font = '40px Joystix';
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.textAlign = 'center';

    context.fillText(`Game Over`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);

    // Decrease the font size
    context.font = '20px Joystix';

    // Description
    context.fillText(
      `You reached level ${this.level} and scored ${this.score} points!`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.56
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.enterHighScore
        ? 'cornflowerblue'
        : 'white';

    // `Enter High Score` menu option
    context.fillText(
      `${this.menuOptions.enterHighScore}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.8
    );
  }

  /**
   * Render the foreground for transition.
   */
  renderForeground() {
    context.fillStyle = `rgb(255, 255, 255, ${this.transitionAlpha})`;
    context.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    context.restore();
  }
}
