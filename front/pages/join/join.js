// current game
let currentGameId = null
// the user on the page
let currentPlayerName = null
let currentPlayerId = null
// the user that is currently playing (can be different from the user on the page)
let playingPlayerId = null
let playingPlayerName = null

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
    case BACK_MESSAGE_TYPE.INIT_PLAYER:
      currentPlayerName = message.data.playerName
      currentPlayerId = message.data.playerId
      break
    case BACK_MESSAGE_TYPE.GAME_READY:
      startGame(message.data.gameId, message.data.wordLength)
      break
    case BACK_MESSAGE_TYPE.NEXT_ROUND:
      handleNextRound(
        message.data.currentPlayerName,
        message.data.currentPlayerId,
        message.data.currentPlayerErrors
      )
      break
    case BACK_MESSAGE_TYPE.GUESS:
      handleGuessResult(message.data.letter, message.data.indexes)
      break
    case BACK_MESSAGE_TYPE.ERROR:
      alert(message.data.message)
      break
    default:
      log("Unknown message type", LOG_TYPE.ERROR)
      break
  }
}

function startGame(gameId, wordLength) {
  currentGameId = gameId
  document.getElementById("waiting").style.display = "none"
  document.getElementById("play").style.display = "flex"

  const lettersList = document.getElementById("mot")
  for (let i = 0; i < wordLength; i++) {
    const letter = document.createElement("li")
    letter.innerText = "_"
    lettersList.appendChild(letter)
  }
}

function handleNextRound(name, id, errors) {
  playingPlayerName = name
  playingPlayerId = id
  document.getElementById(
    "currentPlayer"
  ).innerText = `C'est au tour du joueur ${name}`
  document.getElementById(
    "errorsAllowed"
  ).innerText = `Attention, ${errors} erreurs restantes`
  if (currentPlayerId === id) {
    document.querySelector("#lettre").disabled = false
    document.querySelector("#lettre").focus()
  } else {
    document.querySelector("#lettre").disabled = true
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

function submitGuess(letter) {
  if (letter.length === 1 && letter.match(/[a-z]/i)) {
    connection.send(
      JSON.stringify({
        type: FRONT_MESSAGE_TYPE.SUBMIT_GUESS,
        data: {
          playerId: currentPlayerId,
          playerName: currentPlayerName,
          gameId: currentGameId,
          letter,
        },
      })
    )
  } else {
    alert("Vous devez saisir une seule lettre valide")
  }
}

function handleGuessResult(letter, indexes) {
  const lettersList = document.getElementById("mot")
  indexes.forEach((index) => {
    lettersList.children[index].innerText = letter
  })
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

document.querySelector("#gameForm").addEventListener("submit", (event) => {
  event.preventDefault()
  const lettre = document.querySelector("#lettre").value
  document.querySelector("#lettre").value = ""
  submitGuess(lettre)
})
