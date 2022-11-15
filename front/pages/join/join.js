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
    
    case BACK_MESSAGE_TYPE.ERROR:
      alert(message.data)
      break
    default:
      log("Unknown message type", LOG_TYPE.ERROR)
      break
  }
}

function joinGame(data) {
  connection.send(
    JSON.stringify({
      type: FRONT_MESSAGE_TYPE.JOIN_GAME,
      data,
    })
  )
}

document.getElementById("submitStep1").addEventListener("click", (event) => {
  event.preventDefault()
  const gameId = document.getElementById("gameId").value
  const playerName = document.getElementById("playerName").value
  if (gameId.length > 0 && playerName.length > 0) {
    joinGame({
      gameId,
      playerName,
    })
  } else {
    alert("Vous devez remplir tous les champs")
  }
})
