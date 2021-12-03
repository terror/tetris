import GameStateName from "../enums/GameStateName.js";
import ImageName from "../enums/ImageName.js";
import SoundName from "../enums/SoundName.js";
import State from "../../lib/State.js";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  images,
  keys,
  sounds,
  stateMachine,
} from "../globals.js";

export default class TitleScreenState extends State {
  constructor() {
    super();

    this.menuOptions = {
      start: "Start",
      highScores: "High Scores",
    };

    this.highlighted = this.menuOptions.start;
  }

  update(dt) {
    if (keys.w || keys.s) {
      keys.w = false;
      keys.s = false;
      this.highlighted =
        this.highlighted === this.menuOptions.start
          ? this.menuOptions.highScores
          : this.menuOptions.start;
      sounds.play(SoundName.Rotate);
    }

    if (keys.Enter) {
      keys.Enter = false;
      sounds.play(SoundName.Bump);

      if (this.highlighted === this.menuOptions.start) {
        stateMachine.change(GameStateName.LevelSelect);
      } else {
        stateMachine.change(GameStateName.Highscore);
      }
    }
  }

  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    context.save();

    context.font = "40px Joystix";
    context.fillStyle = "white";
    context.textBaseline = "middle";
    context.textAlign = "center";

    context.fillText(`TETRIS`, CANVAS_WIDTH * 0.5, CANVAS_HEIGHT * 0.5);

    context.font = "20px Joystix";
    context.fillStyle =
      this.highlighted === this.menuOptions.start ? "cornflowerblue" : "white";

    context.fillText(
      `${this.menuOptions.start}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.8
    );

    context.fillStyle =
      this.highlighted === this.menuOptions.highScores
        ? "cornflowerblue"
        : "white";

    context.fillText(
      `${this.menuOptions.highScores}`,
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.9
    );

    context.restore();
  }
}
