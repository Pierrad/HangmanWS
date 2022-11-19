// Vasseur Pierre-Adrien
const WebSocket = require("ws")
const { handleNewGame, handleNewPlayer, checkIfGameIsReady, handleNextRound, handleGuess } = require("./controllers")
const { secureJSONParse, log } = require("./utils") 
const { LOG_TYPE, FRONT_MESSAGE_TYPE } = require("./types")

const games = []

const wss = new WebSocket.Server({
  port: 8080,
})

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    const parsedMessage = secureJSONParse(message)
    log(parsedMessage, LOG_TYPE.RECEIVED)

    switch (parsedMessage.type) {
      case FRONT_MESSAGE_TYPE.INIT_GAME:
        handleNewGame(ws, games, parsedMessage.data)
        break
      case FRONT_MESSAGE_TYPE.JOIN_GAME:
        handleNewPlayer(ws, games, parsedMessage.data)
        const game = checkIfGameIsReady(ws, games, parsedMessage.data.gameId)
        if (game) {
          log("Game is ready", LOG_TYPE.INFO)
          handleNextRound(game)
        }
        break
      case FRONT_MESSAGE_TYPE.SUBMIT_GUESS:
        handleGuess(ws, games, parsedMessage.data)
        break
      default:
        log("Unknown message type", LOG_TYPE.ERROR)
        break
    }
  })
})

