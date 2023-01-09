const mongoose = require('mongoose')
const Schema = mongoose.Schema

const peripheralSchema = new Schema({
  uid: {
    type: Number,
    unique: true,
    required: [true, 'A UID for the peripheral is required']
  },
  vendor: {
    type: String,
    required: [true, 'A vendor for the peripheral is required']
  },
  status: {
    type: String,
    enum: ['offline', 'online'],
    default: 'online'
  },
  gateway: {
    type: Schema.ObjectId,
    ref: 'gateway',
    required: [true, 'A gateway for the peripheral is required']
  }
}, {
  timestamps: true
})

const Peripheral = mongoose.model('peripheral', peripheralSchema)
module.exports = Peripheral
