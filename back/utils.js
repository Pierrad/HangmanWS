const { LOG_TYPE } = require("./types")

const secureJSONParse = (data) => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return null
  }
}


const log = async (message, type) => {
  switch (type) {
    case LOG_TYPE.SENT:
      console.log("📤 Sent message: ", message)
      break
    case LOG_TYPE.RECEIVED:
      console.log("📥 Received message:", message)
      break
    case LOG_TYPE.ERROR:
      console.log("❌ Error:", message)
      break
    default:
      break
  } 
}

module.exports = {
  secureJSONParse,
  log,
}

