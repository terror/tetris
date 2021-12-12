import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../src/globals.js';
import Piece from '../src/objects/Piece.js';
import Vector from './Vector.js';

export default class Queue {
  constructor(items = []) {
    this.items = items;
    this.hold = null;
  }

  /**
   * Create a new `Queue` based on a previous state.
   * @param {Object} state - The previous state
   */
  static fromState(state) {
    const queue = new Queue(state.items.map((item) => Piece.fromState(item)));
    queue.hold = Piece.fromState(state.hold);
    return queue;
  }

  /**
   * Get the next pieces to be rendered.
   * @returns {Array} - The next pieces to be rendered.
   */
  get next() {
    if (!this.empty()) {
      return this.items.slice(-3);
    }
  }

  /**
   * Render the item on hold.
   */
  renderHold() {
    if (this.hold) {
      this.hold.render(new Vector(CANVAS_WIDTH * 0.55, CANVAS_HEIGHT * 0.25));
    }
  }

  /**
   * Render the next item on the queue.
   */
  renderNext() {
    for (let i = 0; i < this.next.length; i++) {
      this.next[i].render(
        new Vector(CANVAS_WIDTH * 0.56 + i * 175, CANVAS_HEIGHT * 0.68)
      );
    }
  }

  /**
   * Push an item onto the queue.
   * @param {*} item
   */
  push(item) {
    this.items.push(item);
  }

  /**
   * Pop off the top of the queue.
   * @returns {*} - The item at the top of the queue.
   */
  pop() {
    return this.items.shift();
  }

  /**
   * Swap the top element with `item` and place it on hold.
   */
  swap(item) {
    // If there's an item on hold, swap `item` with that.
    if (this.hold) {
      this.items[0] = this.hold;
      this.hold = item;
      return;
    }

    // Swap the top element with `item`.
    this.hold = this.pop();
    this.push(Piece.getRandomPiece());
  }

  /**
   * Peek the top of the queue.
   * @returns {*} - The item at the top of the queue.
   */
  top() {
    if (!this.empty()) {
      return this.items[0];
    }
  }

  /**
   * Check whether the queue is empty.
   * @returns {boolean} - Whether or not the queue is empty.
   */
  empty() {
    return this.items.length === 0;
  }

  /**
   * Clear the queue.
   */
  clear() {
    this.items = [];
  }
}
