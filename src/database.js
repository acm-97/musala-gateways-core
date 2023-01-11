const mongoose = require('mongoose')
const connection = mongoose.connection

const { MONGODB_URI } = process.env

mongoose.set('strictQuery', true)

mongoose.connect(MONGODB_URI, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})

connection.once('open', () => {
  console.log('Coneced to MongoDB')
})
