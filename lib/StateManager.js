import GameStateName from '../src/enums/GameStateName.js';
import Board from '../src/objects/Board.js';
import { stateMachine } from '../src/globals.js';
import Vector from './Vector.js';
import Queue from './Queue.js';

export default class StateManager {
  /**
   * Attempt to load the game state from local storage.
   */
  static loadState() {
    // Grab saved state from loca storage
    const state = JSON.parse(localStorage.getItem('state'));

    // If there's a saved state, enter it
    if (state !== null) {
      stateMachine.change(GameStateName.Play, {
        board: Board.fromState(state.board),
        cleared: state.cleared,
        level: state.level,
        pieces: Queue.fromState(state.pieces),
        resumed: true,
        score: state.score,
        timer: state.timer,
      });
    }
  }

  /**
   * Save the current state to local storage.
   * @param {Object} state - The current state of the game.
   */
  static saveState(state) {
    localStorage.setItem('state', JSON.stringify(state));
  }
}
