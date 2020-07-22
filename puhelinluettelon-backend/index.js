const express = require('express')
const morgan = require('morgan')

morgan.token('body', req => {
    const body = JSON.stringify(req.body)

    if (body === '{}') {
        return " "
    } else {
        return body
    }

})

const app = express()

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-43-234345",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "39-23-6423122",
        id: 4
    }
]

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/info', (req, res) => {

    res.send(`<div> <p> Phonebook has info for ${persons.length} people </p>
            <p> ${new Date()} </p> </div>`)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(n => n.id === id)
    
    if (person) {
        res.json(person)
    } else {
        res.status(404).end()
    }

})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const generateId = () => {
    const getRandomInt = (max) => Math.floor(Math.random() * Math.floor(max))
    let id = 0

    if (persons.length > 0) {
        id = persons[0].id
    } else {
        return id
    }
    
    while ( persons.find(n => n.id === id) ) {
        id = getRandomInt(9999)
    }

    return id
}
  
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
    } else if (persons.find(n => n.name === body.name)) {
        return res.status(400).json({
            error: `'${body.name}' exists already`
        })
    }

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)

    res.json(person)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})