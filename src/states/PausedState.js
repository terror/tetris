import State from '../../lib/State.js';
import GameStateName from '../enums/GameStateName.js';
import ImageName from '../enums/ImageName.js';
import SoundName from '../enums/SoundName.js';
import {
  context,
  images,
  keys,
  sounds,
  stateMachine,
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
} from '../globals.js';

export default class PausedState extends State {
  constructor() {
    super();

    this.menuOptions = {
      resume: 'Resume',
      exit: 'Exit',
    };

    this.highlighted = this.menuOptions.resume;
  }

  /**
   * Enter the state.
   * @param {Object} parameters - The parameters to pass to the state.
   */
  enter(parameters) {
    this.state = parameters.state;
  }

  /**
   * Update the state.
   * @param {Number} dt - The delta time.
   */
  update(dt) {
    if (keys.w || keys.s) {
      keys.w = false;
      keys.s = false;
      this.highlighted =
        this.highlighted === this.menuOptions.resume
          ? this.menuOptions.exit
          : this.menuOptions.resume;
      sounds.play(SoundName.Rotate);
    }

    if (keys.Enter) {
      keys.Enter = false;
      sounds.play(SoundName.Bump);

      if (this.highlighted === this.menuOptions.resume) {
        stateMachine.change(GameStateName.Play, {
          board: this.state.board,
          level: this.state.level,
          pieces: this.state.pieces,
          score: this.state.score,
          timer: this.state.timer,
          resumed: true,
        });
      } else {
        stateMachine.change(GameStateName.Title);
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
      this.highlighted === this.menuOptions.resume ? 'cornflowerblue' : 'white';

    // `Resume` menu option
    context.fillText(
      `${this.menuOptions.resume}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.8
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.exit ? 'cornflowerblue' : 'white';

    // `Exit` menu option
    context.fillText(
      `${this.menuOptions.exit}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.9
    );

    context.restore();
  }
}
