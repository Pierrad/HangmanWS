
function createGame(word, nbErrorsAllowed, nbPlayers) {
  const game = {
    id: Math.random().toString(36).substr(2, 9),
    word,
    nbErrorsAllowed: parseInt(nbErrorsAllowed, 10),
    nbPlayers: parseInt(nbPlayers, 10),
    players: [],
    currentPlayerRound: 0,
    round: 0,
    correctLetters: [],
    correctLettersExpected: [],
  }
  return game
}

function createPlayer(game, name) {
  const player = {
    id: Math.random().toString(36).substr(2, 9),
    name,
    errors: game.nbErrorsAllowed,
  }
  return player
}

module.exports = {
  createGame,
  createPlayer,
}
