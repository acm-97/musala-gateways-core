const mongoose = require('mongoose')
const connection = mongoose.connection
const config = require('config')

const db = config.get('MONGODB_URI')

mongoose.set('strictQuery', true)

mongoose.connect(db, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true
})

connection.once('open', () => {
  console.log('Coneced to MongoDB')
})
