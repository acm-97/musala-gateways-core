/**
 * It returns a random number between 1 and 1000.
 */
function generateRandomUID () {
  return Math.trunc(Math.random() * 1000) + 1
}

/**
 * It checks if a string is a valid IP address.
 * @param str - The string to check if it's a valid IP address
 * @returns A boolean value.
 */
function checkIfValidIP (str) {
  // Regular expression to check if string is a IP address
  const regexExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/gi

  return regexExp.test(str)
}

function Errors (err) {
  const messageError = ' Something has gone wrong, please check if your data is correct.'

  if (err.code === 11000) {
    const keys = Object.keys(err.keyValue)
    return {
      ...err,
      messageError: `The value for ${keys[0]} field has to be unique`
    }
  }

  return { ...err, messageError }
}

module.exports = { generateRandomUID, checkIfValidIP, Errors }
