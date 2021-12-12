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
} from '../globals.js';
import StateManager from '../../lib/StateManager.js';

export default class TitleScreenState extends State {
  constructor() {
    super();

    this.menuOptions = {
      start: 'Start',
      load: 'Load',
      highScores: 'High Scores',
    };

    this.highlighted = this.menuOptions.start;
  }

  /**
   * Update the state.
   * @param {Number} dt - The time delta between ticks
   */
  update(dt) {
    // Handle enter
    if (keys.Enter) {
      keys.Enter = false;
      sounds.play(SoundName.Bump);

      if (this.highlighted === this.menuOptions.start) {
        stateMachine.change(GameStateName.LevelSelect);
      } else if (this.highlighted === this.menuOptions.load) {
        StateManager.loadState();
      } else {
        stateMachine.change(GameStateName.HighScore);
      }
    }

    // Handle `w` key press
    if (keys.w) {
      keys.w = false;
      sounds.play(SoundName.Rotate);
      this.highlighted =
        this.highlighted === this.menuOptions.start
          ? this.menuOptions.highScores
          : this.highlighted === this.menuOptions.load
          ? this.menuOptions.start
          : this.highlighted === this.menuOptions.highScores
          ? this.menuOptions.load
          : this.highlighted;
    }

    // Handle `s` key press
    if (keys.s) {
      keys.s = false;
      sounds.play(SoundName.Rotate);
      this.highlighted =
        this.highlighted === this.menuOptions.start
          ? this.menuOptions.load
          : this.highlighted === this.menuOptions.load
          ? this.menuOptions.highScores
          : this.highlighted === this.menuOptions.highScores
          ? this.menuOptions.start
          : this.highlighted;
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

    context.fillText(`TETRIS`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);

    // Decrease the font size
    context.font = '20px Joystix';

    // Description
    context.fillText(
      `The Classic Retro-Style Arcade Game`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.56
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.start ? 'cornflowerblue' : 'white';

    // `Start` menu option
    context.fillText(
      `${this.menuOptions.start}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.7
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.load ? 'cornflowerblue' : 'white';

    // `Load` menu option
    context.fillText(
      `${this.menuOptions.load}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.8
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.highScores
        ? 'cornflowerblue'
        : 'white';

    // `High Scores` menu option
    context.fillText(
      `${this.menuOptions.highScores}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.9
    );

    context.restore();
  }
}
