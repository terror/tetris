import { MAX_HIGH_SCORES } from '../src/globals.js';

/**
 * This class is responsible for reading and writing the high scores
 * of our game to and from the browser's local storage. Local storage
 * is a simple way to store small key/value pairs (kind of like cookies)
 * for a particular domain on your browser.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage
 *
 * Note: Assignment #2 - Breakout - HighScoreManager.js
 */
export default class HighScoreManager {
  static loadHighScores() {
    /**
     * Since the high scores are being saved as a string containing JSON,
     * we must parse the string into a valid JavaScript object in order
     * to manipulate it.
     */
    const highScores = JSON.parse(localStorage.getItem('highScores')) ?? [];

    if (highScores.length === 0) {
      // If there are no scores, we want to populate the scores array with placeholders.
      for (let i = MAX_HIGH_SCORES; i > 0; i--) {
        highScores.push({ name: 'AAA', score: i * 100 });
      }

      /**
       * Since the high scores are represented as a JavaScript object,
       * we must turn the object into a string in order to be able to
       * save it using local storage.
       */
      localStorage.setItem('highScores', JSON.stringify(highScores));
    }

    return highScores;
  }

  static addHighScore(name, score) {
    let highScores = HighScoreManager.loadHighScores();

    // Add the new score to the high scores array.
    highScores.push({ name: name, score: score });

    /**
     * Sort the scores from highest to lowest.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
     */
    highScores = highScores.sort((a, b) => b.score - a.score);

    /**
     * Only keep the top 10 scores.
     *
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
     */
    highScores = highScores.slice(0, MAX_HIGH_SCORES);

    /**
     * Since the high scores are represented as a JavaScript object,
     * we must turn the object into a string in order to be able to
     * save it using local storage.
     */
    localStorage.setItem('highScores', JSON.stringify(highScores));
  }
}
