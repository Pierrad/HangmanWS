function createGame(word, nbErrorsAllowed, nbPlayers) {
  const game = {
    id: Math.random().toString(36).substr(2, 9),
    word,
    nbErrorsAllowed: parseInt(nbErrorsAllowed, 10),
    nbPlayers: parseInt(nbPlayers, 10),
    players: [],
    currentPlayerRound: -1,
    round: -1,
    correctLetters: [],
    correctLettersExpected: calculateCorrectLettersExpected(word),
  }
  return game
}

function createPlayer(ws, game, name) {
  const player = {
    id: Math.random().toString(36).substr(2, 9),
    ws,
    name,
    errors: game.nbErrorsAllowed,
    isAlive: true,
    numberOfLettersFound: 0,
  }
  return player
}

function calculateCorrectLettersExpected(word) {
  const correctLettersExpected = []
  for (let i = 0; i < word.length; i++) {
    const letter = word[i]
    if (!correctLettersExpected.includes(letter)) {
      correctLettersExpected.push(letter)
    }
  }
  return correctLettersExpected
}

function getIndexOfLetterInWord(word, letter) {
  const indexes = []
  for (let i = 0; i < word.length; i++) {
    if (word[i] === letter) {
      indexes.push(i)
    }
  }
  return indexes
}

function addToCorrectLetters(correctLetters, letter) {
  if (!correctLetters.includes(letter)) {
    correctLetters.push(letter)
  }
}

module.exports = {
  createGame,
  createPlayer,
  getIndexOfLetterInWord,
  addToCorrectLetters,
}
