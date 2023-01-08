const mongoose = require('mongoose')
const connection = mongoose.connection
const config = require('config')

const db = config.get('MONGODB_URI')

mongoose.connect(db, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
})

connection.once('open', () => {
  console.log('Coneced to MongoDB')
})
