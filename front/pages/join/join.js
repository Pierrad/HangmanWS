let currentGameId = null
let currentPlayerName = null

connection = new WebSocket("ws://localhost:8080", "http")

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
    case BACK_MESSAGE_TYPE.B_INIT_PLAYER:
      currentPlayerName = message.data.playerName
      break
    case BACK_MESSAGE_TYPE.GAME_READY:
      startGame(message.data.gameId)
      break
    case BACK_MESSAGE_TYPE.ERROR:
      alert(message.data)
      break
    default:
      log("Unknown message type", LOG_TYPE.ERROR)
      break
  }
}

function startGame(gameId) {
  currentGameId = gameId
  document.getElementById("waiting").style.display = "none"
  document.getElementById("play").style.display = "flex"
}

function joinGame(data) {
  connection.send(
    JSON.stringify({
      type: FRONT_MESSAGE_TYPE.JOIN_GAME,
      data,
    })
  )
}

document.getElementById("submitJoin").addEventListener("click", (event) => {
  event.preventDefault()
  const gameId = document.getElementById("gameId").value
  const playerName = document.getElementById("playerName").value
  if (gameId.length > 0 && playerName.length > 0) {
    joinGame({
      gameId,
      playerName,
    })
    document.getElementById("join").style.display = "none"
    document.getElementById("waiting").style.display = "flex"
  } else {
    alert("Vous devez remplir tous les champs")
  }
})
