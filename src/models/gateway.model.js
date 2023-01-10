const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gatewaySchema = new Schema({
  name: {
    type: String,
    required: [true, 'A name for the gateway is required']
  },
  ipv4_address: {
    type: String,
    required: [true, 'A ipv4 address for the gateway is required']
  }
}, {
  timestamps: true
})

const Gateway = mongoose.model('gateway', gatewaySchema)
module.exports = Gateway
