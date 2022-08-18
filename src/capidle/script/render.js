import { gameModes, generatePuzzle } from "./puzzle";
import {
  $,
  GAME_MODE,
  NUMBER_OF_GUESSES,
  distanceBetween,
  directionBetween,
} from "./util";

/** @type {L.Map} */
let map;

/** @type {import("./puzzle").Answer[]} the list of gusses that the user has made */
export let guesses = [];

/** @type {import("./puzzle").Answer} the correct answer */
let answer;

/**
 * this function re-renders the whole game.
 * It is called when the user changes the game state.
 */
export function render() {
  // if this is the first render, there won't be answer yet so we generate one
  if (!answer) answer = generatePuzzle(GAME_MODE);

  // check if the user's most recent guess was correct
  const prevGuess = guesses.slice(-1)[0];
  const prevGuessWasCorrect = answer.names.en === prevGuess?.names.en;
  if (prevGuessWasCorrect) return renderResultsUi(/* successful */ true);

  // check if the user has run out of guesses
  const isGameOver = guesses.length === NUMBER_OF_GUESSES;
  if (isGameOver) return renderResultsUi(/* successful */ false);

  renderGameUi();
}

function renderGameUi() {
  const gameMode = gameModes[GAME_MODE];
  $("#guess-rows").innerHTML = new Array(NUMBER_OF_GUESSES)
    .fill(null)
    .map((_, i) => {
      // for each row, either render the guess, or an empty slot
      const guess = guesses[i];

      if (!guess) return `<div class="empty-guess"></div>`;

      const hintDistance = distanceBetween(
        guess.lat,
        guess.lng,
        answer.lat,
        answer.lng
      );
      const hintDirection = directionBetween(
        guess.lat,
        guess.lng,
        answer.lat,
        answer.lng
      );

      return `
            <div class="guess">
              <span>${guess.names.en}</span>
              <span>${Math.round(hintDistance)} km</span>
              <span>${hintDirection}</span>
            </div>
      `;
    })
    .join("");

  if (!map) map = L.map("map", { zoomDelta: 0.5 }).setView([51.505, -0.09], 13);

  /** @type {L.TileLayer | null} the current aerial imagery */
  let layer = null;
  map.eachLayer((l) => {
    if (l instanceof L.TileLayer) layer = l;
  });

  // remove the imagery if it's wrong (or from a different game mode)
  if (layer && layer._url != gameMode.tileServer) {
    map.removeLayer(layer);
    layer = null;
  }

  if (!layer) {
    // there's no tile layer configured, so we add one
    L.tileLayer(gameMode.tileServer, {
      // minZoom: 12, // this could be a "hard mode"
      maxZoom: 19,
      attribution: gameMode.attribution,
    }).addTo(map);
  }

  // add a marker at the answer location
  L.marker([answer.lat, answer.lng]).addTo(map);

  // after each guess, move the map back to the default position
  map.setView([answer.lat, answer.lng], 15);
}

/** @param {boolean} successful - whether the user solved the puzzle */
function renderResultsUi(successful) {
  const link = `https://google.com/maps?q=${answer.names.en},+NZ`;

  $("main").innerHTML = `
    <div class="answer">
      <span>${successful ? "✅" : "❌"}</span>
      <div>${successful ? "Correct!" : "Game Over!<br />The Answer was:"}</div>
      <a href="${link}" target="_blank" rel="noopener noreferrer">
        ${answer.names.en}
      </a>
      <button onclick="location.reload()">Play Again</button>
    </div>
  `;
}
