import Direction from '../enums/Direction.js';
import GameStateName from '../enums/GameStateName.js';
import ImageName from '../enums/ImageName.js';
import SoundName from '../enums/SoundName.js';
import Piece from '../objects/Piece.js';
import PieceFactory from '../services/PieceFactory.js';
import PieceType from '../enums/PieceType.js';
import State from '../../lib/State.js';
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  context,
  images,
  keys,
  MAX_LEVEL,
  sounds,
  stateMachine,
  timer,
} from '../globals.js';

export default class PlayState extends State {
  constructor() {
    super();

    // Current level
    this.level = 1;

    // Player score, increases as the player places more pieces
    this.score = 0;

    // Score we have to reach to get to the next level
    this.goal = 20;

    // How much goal will be scaled by per level
    this.goalScale = 1.25;

    // How much to scale up the time per level
    this.timerScale = 1.25;

    // How much to scale the interval down per level
    this.intervalScale = 0.05;

    // Add `20` points if the player sweeps a line
    this.sweepBonus = 20;

    // Rate at which pieces fall
    this.interval = 1000;

    // Current interval
    this.currentInterval = 0;

    // Current amount of ticks
    this.currentTicks = 0;

    // Number of lines cleared
    this.cleared = 0;

    // Time needed to beat the level
    this.maxTimer = 60;
    this.timer = this.maxTimer;
  }

  /**
   * Enter this state
   * @param {Object} parameters - Parameters to set
   */
  enter(parameters) {
    this.board = parameters.board;
    this.score = parameters.score;
    this.level = parameters.level;
    this.pieces = parameters.pieces;

    // Resumed state
    this.cleared = parameters.cleared ?? 0;
    this.timer = parameters.timer ?? this.maxTimer;

    // If we didn't resume the game, perform these operations
    if (!parameters.resumed) {
      // Scale the timer accordingly, more time for higher levels
      this.timer *= Math.floor(this.level * this.timerScale);

      // Scale the goal according to the current level
      this.goal = 20;
      this.goal *= Math.floor(this.level * this.goalScale);

      // Scale the interval at which pieces fall accordingly, faster for higher levels
      this.interval -= Math.floor(
        this.interval * (this.intervalScale * this.level)
      );

      // Begin the level timer
      this.startTimer();
    }
  }

  /**
   * Get the current piece.
   * @returns {Piece} The current piece
   */
  get piece() {
    return this.pieces.top();
  }

  /**
   * Update the play state.
   * @param {Number} dt - The time delta between frames
   */
  update(dt) {
    // Update the current interval and check if we need to move the piece down
    this.currentInterval += dt * 1000;
    if (this.currentInterval > this.interval) {
      this.tick();
    }

    // Pause the game
    if (keys.p) {
      keys.p = false;
      stateMachine.change(GameStateName.Paused, { state: this });
    }

    // Place a piece on `hold`
    if (keys.Enter) {
      keys.Enter = false;
      if (this.currentTicks === 0) {
        this.pieces.swap(this.piece);
      }
    }

    // Place the piece all the way down
    if (keys[' ']) {
      keys[' '] = false;
      this.dropping = true;
      while (this.dropping) {
        this.piece.move({ state: this, direction: Direction.Down });
      }
    }

    // Handle player movement
    if (keys.a) {
      keys.a = false;
      this.piece.move({ state: this, direction: Direction.Left });
    } else if (keys.d) {
      keys.d = false;
      this.piece.move({ state: this, direction: Direction.Right });
    } else if (keys.w) {
      keys.w = false;
      this.piece.rotate(this.board);
      sounds.play(SoundName.Rotate);
    } else if (keys.s) {
      keys.s = false;
      this.currentTicks += 1;
      this.piece.move({ state: this, direction: Direction.Down });
    }

    timer.update(dt);
  }

  /**
   * Render the entire scene.
   */
  render() {
    context.save();

    // Render the background
    images.render(ImageName.Background, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Render the user interface
    this.renderHeader();
    this.renderStatistics();
    this.renderGame();
    this.renderHold();
    this.renderNext();

    context.restore();
  }

  /**
   * Render the header.
   */
  renderHeader() {
    // Title
    context.font = '40px Joystix';
    context.fillStyle = 'white';
    context.textBaseline = 'middle';
    context.textAlign = 'center';
    context.fillText(`TETRIS`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.05);

    // Description
    context.font = '20px Joystix';
    context.fillText(
      `The Classic Retro-Style Arcade Game`,
      CANVAS_WIDTH * 0.75,
      CANVAS_HEIGHT * 0.1
    );
  }

  /**
   * Render the statistics pane.
   */
  renderStatistics() {
    // Stastics border
    context.strokeStyle = 'white';
    context.strokeRect(
      CANVAS_WIDTH * 0.75 - 50,
      CANVAS_HEIGHT * 0.25 - 50,
      CANVAS_WIDTH * 0.85 - CANVAS_WIDTH * 0.65 + 95,
      CANVAS_HEIGHT * 0.35 - CANVAS_HEIGHT * 0.15 + 120
    );

    // Render all statistics
    context.font = '25px Play';
    context.textAlign = 'left';

    context.fillText(`Level:`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.21);
    context.fillText(`Score:`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.28);
    context.fillText(`Goal:`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.36);
    context.fillText(`Cleared:`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.44);
    context.fillText(`Timer:`, CANVAS_WIDTH * 0.75, CANVAS_HEIGHT * 0.52);

    context.textAlign = 'right';

    context.fillText(
      `${this.level}`,
      CANVAS_WIDTH * 0.95,
      CANVAS_HEIGHT * 0.21
    );
    context.fillText(
      `${this.score}`,
      CANVAS_WIDTH * 0.95,
      CANVAS_HEIGHT * 0.28
    );
    context.fillText(`${this.goal}`, CANVAS_WIDTH * 0.95, CANVAS_HEIGHT * 0.36);
    context.fillText(
      `${this.cleared}`,
      CANVAS_WIDTH * 0.95,
      CANVAS_HEIGHT * 0.44
    );
    context.fillText(
      `${this.timer}`,
      CANVAS_WIDTH * 0.95,
      CANVAS_HEIGHT * 0.52
    );
  }

  /**
   * Render the piece on hold.
   */
  renderHold() {
    // Hold border
    context.strokeStyle = 'white';
    context.strokeRect(
      CANVAS_WIDTH * 0.54 - 50,
      CANVAS_HEIGHT * 0.25 - 50,
      CANVAS_WIDTH * 0.85 - CANVAS_WIDTH * 0.65,
      CANVAS_HEIGHT * 0.35 - CANVAS_HEIGHT * 0.15 + 120
    );

    // Hold piece
    context.fillStyle = 'white';
    context.fillText(`Hold`, CANVAS_WIDTH * 0.63, CANVAS_HEIGHT * 0.21);
    this.pieces.renderHold();
  }

  /**
   * Render the next piece.
   */
  renderNext() {
    // Next piece border
    context.strokeStyle = 'white';
    context.strokeRect(
      CANVAS_WIDTH * 0.5,
      CANVAS_HEIGHT * 0.6 - 20,
      CANVAS_WIDTH * 0.85 - CANVAS_WIDTH * 0.6 + 300,
      CANVAS_HEIGHT * 0.55 - CANVAS_HEIGHT * 0.15 + 10
    );

    // Next piece
    context.fillStyle = 'white';
    context.fillText(`Queue`, CANVAS_WIDTH * 0.78, CANVAS_HEIGHT * 0.62);
    this.pieces.renderNext();
  }

  renderGame() {
    // Render the board and our current piece
    this.board.render();
    this.piece.render();
  }

  /**
   * Decrement the timer each second.
   */
  startTimer() {
    timer.addTask(() => --this.timer, 1, this.maxTimer);
  }

  /**
   * Move the piece down.
   */
  tick() {
    // Reset the interval and move the piece down
    this.currentInterval = 0;
    this.currentTicks += 1;
    this.piece.move({ state: this, direction: Direction.Down });
  }

  /**
   * Handle a tick.
   */
  handleTick() {
    // If the piece collided with the board, place it and check for lines
    if (this.piece.didCollide(this.board)) {
      // If the piece is currently dropping, we need to stop it
      this.dropping = false;

      // Move the piece up
      this.piece.move({ state: this, direction: Direction.Up });

      // Add it to the board
      this.board.add(this.pieces.pop());

      // Set a new random piece
      this.pieces.push(Piece.getRandomPiece());

      // Check for lines
      this.handlePlacement(
        this.board.sweep(),
        this.piece.didCollide(this.board)
      );
    }
  }

  /**
   * Handle placing a single piece.
   * @param {Number} cleared - The number of lines cleared
   * @param {Boolean} didCollide - If the new piece collided with the board
   */
  handlePlacement(cleared, didCollide) {
    // Reset current ticks
    this.currentTicks = 0;

    // Placed blocks get one point
    this.score += 1;

    // Increment lines cleared
    this.cleared += cleared;

    // Add bonus points for cleared lines
    this.score += this.sweepBonus * cleared;

    // Check if we've won
    this.checkVictory();

    // Check if we've lost
    this.checkGameOver(didCollide);
  }

  /**
   * Transitions to the next level if the player has won.
   */
  checkVictory() {
    // Return if we haven't reached the goal
    if (this.score < this.goal) {
      return;
    }

    // Play victory sound
    sounds.play(SoundName.Victory);

    // If we're on the last level, transition to the `victory` state
    if (this.level === MAX_LEVEL) {
      // Transition to the victory state
      stateMachine.change(GameStateName.Victory, {
        score: this.score,
      });
      return;
    }

    // Go on to the next level
    stateMachine.change(GameStateName.LevelTransition, {
      cleared: this.cleared,
      level: this.level + 1,
      score: this.score,
    });
  }

  /**
   * Transitions to the `game over` state if the player has lost.
   */
  checkGameOver(didCollide) {
    // The timer has not run out yet nor did a new piece
    // collide with the top of the board.
    if (this.timer > 0 && !didCollide) {
      return;
    }

    // Play game over sound
    sounds.play(SoundName.GameOver);

    // Transition to the `game over` state
    stateMachine.change(GameStateName.GameOver, {
      level: this.level,
      score: this.score,
    });
  }
}
