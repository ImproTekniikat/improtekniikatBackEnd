const mongoose = require('mongoose')
require('dotenv').config()

if ( process.env.NODE_ENV !== 'production' ) {
  require('dotenv').config()
}

const url = process.env.MONGODB_URI
mongoose.connect(url)

const exerciseSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String
})

exerciseSchema.statics.formatExercise = (exercise) => {
  return {
    Name: exercise.name,
    Description: exercise.description,
    Category: exercise.category,
    id: exercise.id
  }
}

const Exercise = mongoose.model('Exercise', exerciseSchema)

module.exports = Exercise
