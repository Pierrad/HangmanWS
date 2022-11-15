const { createGame, createPlayer } = require("./services")
const { BACK_MESSAGE_TYPE } = require("./types")

function handleNewGame(ws, games, data) {
  const game = createGame(data.wordToGuess, data.nbErrors, data.nbPlayers)
  games.push(game)
  ws.send(JSON.stringify({
    type: BACK_MESSAGE_TYPE.INIT_GAME,
    data: {
      gameId: game.id,
    },
  }))
}

function handleNewPlayer(ws, games, data) {
  const game = games.find((g) => g.id === data.gameId)
  if (!game) {
    handleError(ws, "Game not found")
    return
  }
  const player = createPlayer(game, data.playerName)
  game.players.push(player)
  games.splice(games.indexOf(game), 1, game)
  ws.send(JSON.stringify({
    type: BACK_MESSAGE_TYPE.INIT_PLAYER,
    data: {
      playerId: player.id,
    },
  }))
}

function checkIfGameIsReady(ws, games, gameId) {
  const game = games.find((g) => g.id === gameId)
  if (!game) {
    handleError(ws, "Game not found")
    return
  }
  if (game.players.length === game.nbPlayers) {
    ws.send(JSON.stringify({
      type: BACK_MESSAGE_TYPE.GAME_READY,
      data: {
        gameId,
      },
    }))
  }
}

function handleError(ws, message) {
  ws.send(JSON.stringify({
    type: BACK_MESSAGE_TYPE.ERROR,
    data: {
      message,
    },
  }))
}

module.exports = {
  handleNewGame,
  handleNewPlayer,
  checkIfGameIsReady,
}
