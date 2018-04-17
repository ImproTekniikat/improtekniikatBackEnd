const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config()
const Exercise = require('./models/exercise')

const app = express()
// the middlewares
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use(morgan(':method :url :req :status :res[content-length] - :response-time ms'))
morgan.token('req', function (req, res) { return JSON.stringify( req.body ) })

app.get('/api/exercises', (req, res) => {
  Exercise
    .find({})
    .then(exercises => {
      res.json(exercises.map(Exercise.formatExercise))
    })
    .catch(error => {
      console.log(error)
    })
})

app.get('/info', (req, res) => {
  Exercise
    .count()
    .then(count => {
      res.send(`There are ${count} exercises <br/> `
      + `${new Date()}`)
    })
    .catch(error => {
      console.log(error)
      res.status(400).send({ error: 'count failed!' })
    })
})

app.get('/api/exercises/:id', (request, response) => {
  Exercise
    .findById(request.params.id)
    .then(exercise => {
      if (exercise) {
        response.json(Exercise.formatExercise(exercise))
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.delete('/api/exercises/:id', (request, response) => {
  Exercise
    .findByIdAndRemove(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/exercises', (request, response) => {
  const exercise = request.body
  if (exercise.Name === undefined || exercise.Description === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }
  const newExercise = new Exercise({
    name: exercise.Name,
    description: exercise.Description,
    category: exercise.Category
  })

  Exercise
    .find({ name: exercise.name })
    .then(result => {
      console.log(result)
    if(result.length > 0) {
        response.status(400).send({ error: `${exercise.name} allready exists!` })
      }
      else {
        newExercise
          .save()
          .then(savedExercise => {
            response.json(Exercise.formatExercise(savedExercise))
          })
          .catch(error => {
            console.log(error)
            response.status(400).send({ error:  `error adding new exercise ${exercise} ` })
          })
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error:  `error checking exercise ${exercise} ` })
    })
})

app.put('/api/exercises/:id', (request, response) => {
  const body = request.body

  const exercise = {
    name: body.Name,
    description: body.Description,
    category: body.Category
  }

  Exercise
    .findByIdAndUpdate(request.params.id, exercise, { new: true } )
    .then(updatedExercise => {
      response.json(Exercise.formatExercise(updatedExercise))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})