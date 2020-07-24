const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config()
const Person = require('./models/person')

const { response } = require('express')

morgan.token('body', req => {
  const body = JSON.stringify(req.body)

  if (body === '{}') {
    return " "
  } else {
    return body
  }
})

const app = express()

app.use(express.static('build'))
app.use(express.json())
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


app.get('/info', (req, res) => {
  res.send(`<div> <p> Phonebook has info for ${Person.length} people </p>
            <p> ${new Date()} </p> </div>`)
})


app.get('/api/persons', (req, res) => {
  Person.find({}).then( persons => {
    res.json(persons.map(person => person.toJSON()))
  })
})


app.post('/api/persons', (req, res) => {
  const body = req.body
  
  if (!body.name) {
    return res.status(400).json({ 
      error: 'name missing' 
    })
  } else if (!body.number) {
    return res.status(400).json({
      error: 'number missing'
    })
  }

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    res.json(savedPerson)
  })
})


app.get('/api/persons/:id', (req, res, next) => {
  const id = req.params.id

  Person
    .findById(id)
      .then(person => {
        if (person) {
          res.json(person.toJSON())
        } else {
          res.status(404).end()
        }
      })
      .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndRemove(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(req.params.id, person, {new: true})
    .then(updatedPerson => {
      res.json(updatedPerson.toJSON())
    })
    .catch(error => next(error))

})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind == 'ObjectId') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})