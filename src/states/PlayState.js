import State from '../../lib/State.js';
import ImageName from '../enums/ImageName.js';
import { CANVAS_HEIGHT, CANVAS_WIDTH, images } from '../globals.js';

export default class PlyState extends State {
  constructor() {
    super();
  }

  enter(parameters) {}

  update(dt) {}

  render() {
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}
