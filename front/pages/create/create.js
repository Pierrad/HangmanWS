const currentHost = window.location.host.split(":")[0]
connection = new WebSocket(`ws://${currentHost}:8080`, "http")

connection.onopen = () => {
  console.log("connected")
}

connection.onclose = () => {
  console.error("disconnected")
}

connection.onerror = (error) => {
  console.error("failed to connect", error)
}

connection.onmessage = (event) => {
  const message = secureJSONParse(event.data)
  log(message, LOG_TYPE.RECEIVED)
  switch (message.type) {
    case BACK_MESSAGE_TYPE.INIT_GAME:
      renderGameID(message.data.gameId)
      break
    default:
      log("Unknown message type", LOG_TYPE.ERROR)
      break
  }
}

function renderGameID(gameID) {
  const gameIDContainer = document.getElementById("gameId")
  gameIDContainer.innerHTML = `L'id de la partie est ${gameID}, vous pouvez le partager avec les joueurs`
}

function sendInitGameToServer(data) {
  connection.send(
    JSON.stringify({
      type: FRONT_MESSAGE_TYPE.INIT_GAME,
      data,
    })
  )
}

document.getElementById("submitForm").addEventListener("click", (event) => {
  event.preventDefault()
  const wordToGuess = document.getElementById("wordToGuess").value
  const nbErrors = document.getElementById("nbTries").value
  const nbPlayers = document.getElementById("nbPlayers").value
  if (wordToGuess.length > 0 && nbErrors > 0 && nbPlayers > 0) {
    sendInitGameToServer({
      wordToGuess,
      nbErrors,
      nbPlayers,
    })
  } else {
    alert("Vous devez remplir tous les champs")
  }
})
