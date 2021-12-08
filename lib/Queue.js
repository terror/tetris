import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../src/globals.js';
import Vector from './Vector.js';

export default class Queue {
  constructor(items = []) {
    this.items = items;
  }

  /**
   * Get the next block to be rendered.
   * @returns {Piece} - The next block to be rendered.
   */
  get next() {
    if (!this.empty()) {
      return this.items[1];
    }
  }

  /**
   * Render the next item on the queue.
   */
  renderNext() {
    this.next.render(new Vector(CANVAS_WIDTH * 0.7, CANVAS_HEIGHT * 0.6));
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
