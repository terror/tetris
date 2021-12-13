/**
 * Tetris
 *
 * Liam Scalzulli
 *
 * The classic retro arcade game tetris.
 *
 * Asset sources
 *
 * Credit for music
 *   Bump:    https://freesound.org/people/Raclure/sounds/483602/
 *   Click:   https://freesound.org/people/errysn/sounds/439523/
 *   Over:    https://freesound.org/people/myfox14/sounds/382310/
 *   Removal: https://freesound.org/people/Swedger/sounds/268694/
 *   Success: https://freesound.org/people/grunz/sounds/109662/
 *   Theme:   https://nhacchuong68.com/tetris-theme-song/
 *
 * Credit for graphics
 *   Background:   https://images.squarespace-cdn.com/content/v1/51be3e56e4b09edc5f81e74c/1420522052397-Q0FUORF4G23WDPLQISEA/image-asset.png?format=1500w
 *   Pieces:       https://www.spriters-resource.com/nes/tetris/
 *   Joystix Font: https://www.dafont.com/joystix.font
 *   Play Font:    https://fonts.google.com/specimen/Play
 */

import GameStateName from './enums/GameStateName.js';
import Game from '../lib/Game.js';

// States
import EnterHighScoreState from './states/EnterHighScoreState.js';
import GameOverState from './states/GameOverState.js';
import HighScoreState from './states/HighScoreState.js';
import LevelSelectState from './states/LevelSelectState.js';
import LevelTransitionState from './states/LevelTransitionState.js';
import PausedState from './states/PausedState.js';
import PlayState from './states/PlayState.js';
import TitleScreenState from './states/TitleScreenState.js';
import VictoryState from './states/VictoryState.js';

import {
  canvas,
  context,
  fonts,
  images,
  keys,
  sounds,
  stateMachine,
} from './globals.js';

// Fetch the asset definitions from config.json.
const {
  images: imageDefinitions,
  fonts: fontDefinitions,
  sounds: soundDefinitions,
  // @ts-ignore
} = await fetch('./src/config.json').then((response) => response.json());

// Load all the assets from their definitions.
images.load(imageDefinitions);
fonts.load(fontDefinitions);
sounds.load(soundDefinitions);

// Add all the states to the state machine.
stateMachine.add(GameStateName.EnterHighScore, new EnterHighScoreState());
stateMachine.add(GameStateName.GameOver, new GameOverState());
stateMachine.add(GameStateName.HighScore, new HighScoreState());
stateMachine.add(GameStateName.LevelSelect, new LevelSelectState());
stateMachine.add(GameStateName.LevelTransition, new LevelTransitionState());
stateMachine.add(GameStateName.Paused, new PausedState());
stateMachine.add(GameStateName.Play, new PlayState());
stateMachine.add(GameStateName.Victory, new VictoryState());
stateMachine.add(GameStateName.Title, new TitleScreenState());

// Add event listeners for player input.
canvas.addEventListener('keydown', (event) => {
  keys[event.key] = true;
});

canvas.addEventListener('keyup', (event) => {
  keys[event.key] = false;
});

const game = new Game(stateMachine, context, canvas.width, canvas.height);

game.start();

// Focus the canvas so that the player doesn't have to click on it.
canvas.focus();
