const express = require('express')
const app = express()
const config = require('config')
const debug = require('debug')('aplication:server')
const morgan = require('morgan')
const http = require('http')
require('../src/database')
const cors = require('cors')

/**
 * instal morgan for routes
 */
app.use(morgan('dev'))

app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb' }))

app.use(
  cors({
    origin: 'http://127.0.0.1:5173', // allow to server to accept request from different origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // allow session cookie from browser to pass through
  })
)

// routes
app.use(require('./routes/gateway.routes'))
app.use(require('./routes/peripheral.routes'))

/**
 * Get port from config and store in Express.
 */
const port = config.get('port')
app.set('port', port)

/**
 * Create HTTP server.
 */
const server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port || 5000, function () {
  console.log(`Server running on: http://localhost:${port}`)
})
server.on('error', onError)
server.on('listening', onListening)

/**
 * Event listener for HTTP server "error" event.
 */
function onError (error) {
  if (error.syscall !== 'listen') {
    throw error
  }
  const bind = typeof port === 'string' ? `Pipe ${port}` : `Port ${port}`

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EADDRINUSE':
      console.error(bind + ' is already in use')
      process.exit(1)
      break
    default:
      throw error
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */
function onListening () {
  const address = server.address()
  const bind =
    typeof address === 'string' ? `pipe ${address}` : `port ${address.port}`
  debug('Listening on ' + bind)
}

module.exports = app
