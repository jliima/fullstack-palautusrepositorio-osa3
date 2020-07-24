const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
} else if (process.argv.length > 5) {
  console.log('too many arguments')
  process.exit(1)
} else if (process.argv.length === 4) {
  console.log('too few arguments')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://hieroja:${password}@cluster0.z8oso.mongodb.net/puhelinluettelo-app?retryWrites=true`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Persons', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')

    result.forEach(person => {
      console.log(person.name, person.number)
    })

    mongoose.connection.close()
  })
} else {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4]
  })

  person.save().then(response => {
    console.log(`added ${person.name} number ${person.number} to phonebook`)
    mongoose.connection.close()
  })
}
