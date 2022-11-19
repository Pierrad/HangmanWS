const { createGame, createPlayer, getIndexOfLetterInWord, addToCorrectLetters } = require("./services")
const { BACK_MESSAGE_TYPE } = require("./types")

function handleNewGame(ws, games, data) {
  const game = createGame(data.wordToGuess, data.nbErrors, data.nbPlayers)
  games.push(game)
  ws.send(
    JSON.stringify({
      type: BACK_MESSAGE_TYPE.INIT_GAME,
      data: {
        gameId: game.id,
      },
    })
  )
}

function handleNewPlayer(ws, games, data) {
  const game = games.find((g) => g.id === data.gameId)
  if (!game) {
    handleError(ws, "Game not found")
    return
  }
  const player = createPlayer(ws, game, data.playerName)
  game.players.push(player)
  games.splice(games.indexOf(game), 1, game)
  ws.send(
    JSON.stringify({
      type: BACK_MESSAGE_TYPE.INIT_PLAYER,
      data: {
        playerId: player.id,
        playerName: player.name,
      },
    })
  )
}

function checkIfGameIsReady(ws, games, gameId) {
  const game = games.find((g) => g.id === gameId)
  if (!game) {
    handleError(ws, "Game not found")
    return
  }
  if (game.players.length === game.nbPlayers) {
    game.players.forEach((player) => {
      player.ws.send(
        JSON.stringify({
          type: BACK_MESSAGE_TYPE.GAME_READY,
          data: {
            gameId,
            wordLength: game.word.length,
          },
        })
      )
    })
    return game
  }
  return false
}

function handleNextRound(game) {
  if (game.correctLetters.length === game.correctLettersExpected.length) {
    const winner = game.players.reduce((acc, player) => {
      if (player.numberOfLettersFound > acc.numberOfLettersFound) {
        return player
      }
      return acc
    }, { numberOfLettersFound: 0 })

    handlePlayersMessage(game, BACK_MESSAGE_TYPE.ERROR, { message: `Félicitations ! Vous avez deviné le bon mot. ${winner.name} est le joueur qui a trouvé le plus de lettres.` })
    return
  } else if (game.players.filter((p) => p.isAlive).length === 0) {
    handlePlayersMessage(game, BACK_MESSAGE_TYPE.ERROR, { message: "Vous avez tous perdu ! Commencez une nouvelle partie pour rejouer." })
    return
  }

  game.round += 1
  game.currentPlayerRound = (game.currentPlayerRound + 1) % game.players.length
  const currentPlayer = game.players[game.currentPlayerRound]
  if (!currentPlayer.isAlive) {
    handleNextRound(game)
    return
  }

  game.players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type: BACK_MESSAGE_TYPE.NEXT_ROUND,
        data: {
          round: game.round,
          currentPlayerName: game.players[game.currentPlayerRound].name,
          currentPlayerId: game.players[game.currentPlayerRound].id,
          currentPlayerErrors: game.players[game.currentPlayerRound].errors,
        },
      })
    )
  })
}

function handleGuess(ws, games, data) {
  const { playerId, playerName, gameId, letter } = data
  const game = games.find((g) => g.id === gameId)
  if (!game) {
    handleError(ws, "Game not found")
    return
  }

  const player = game.players.find((p) => p.id === playerId && p.name === playerName)
  if (!player) {
    handleError(ws, "Player not found")
    return
  }

  const indexes = getIndexOfLetterInWord(game.word, letter)

  if (indexes.length === 0) {
    player.errors -= 1
    handlePlayersMessage(game, BACK_MESSAGE_TYPE.ERROR, { message: `${playerName} n'a pas proposé la bonne lettre : ${letter}` })
    if (player.errors === 0) {
      player.isAlive = false
      handlePlayersMessage(game, BACK_MESSAGE_TYPE.ERROR, { message: `${player.name} n'a plus de vie !` } )
    }
  } else {
    player.numberOfLettersFound += indexes.length
    addToCorrectLetters(game.correctLetters, letter)
  }

  handlePlayersMessage(game, BACK_MESSAGE_TYPE.GUESS, { letter, indexes })

  handleNextRound(game)
}

function handlePlayersMessage(game, type, data) {
  game.players.forEach((player) => {
    player.ws.send(
      JSON.stringify({
        type,
        data,
      })
    )
  })
}

function handleError(ws, message) {
  ws.send(
    JSON.stringify({
      type: BACK_MESSAGE_TYPE.ERROR,
      data: {
        message,
      },
    })
  )
}

module.exports = {
  handleNewGame,
  handleNewPlayer,
  checkIfGameIsReady,
  handleNextRound,
  handleGuess,
}
