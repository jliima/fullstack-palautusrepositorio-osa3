import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import phonebook from './services/phonebook'
import Notification from './components/Notification'


const App = () => {
  const [persons, setPersons] = useState([])
  const [ filter, setFilter ] = useState('')
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [notificationColor, setNotificationColor] = useState(null)

  useEffect(() => {
    phonebook
      .getAll()
        .then(initialPersons => {
          setPersons(initialPersons)
        })
  }, [])

  const notification = (color, message) => {
    setNotificationColor(color)
    setNotificationMessage(message)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 3000)
  }

  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber
    }

    const arrayid = persons.map(person => person.name).indexOf(newName)

    if (arrayid === -1) {
      phonebook
        .create(newPerson)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNewNumber('')
          notification('green', `Addded ${newName}`)
        })

    } else if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)) {
      const id = persons[arrayid].id
      phonebook
        .update(id, newPerson)
        .then(returnedPerson => {
          setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
          setNewName('')
          setNewNumber('')
          notification('green', `The phonenumber of ${newName} has been changed`)
        })
    }

  }
  
  const deletePerson = (id) => {
    const personName = persons.filter(n => n.id === id)[0].name
    if (window.confirm(`Delete ${personName}?`)) {
      phonebook
        .deletePerson(id)
        .then(response => {
          notification('red', `Deleted ${personName}`)
          setPersons(persons.filter(n => n.id !== id))
        })
        .catch(error => {
          notification('red', `The person '${personName}' was already deleted from server.`)
          setPersons(persons.filter(n => n.id !== id))
        })
    }
  }

  const handleSetNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleSetNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={notificationMessage} color={notificationColor} />
      <Filter filter={filter} setFilter={setFilter} 
                               handleFilterChange={handleFilterChange} />
      
      <h3>Add a new</h3>
      <PersonForm newName={newName} newNumber={newNumber} 
                  addPerson={addPerson} handleSetNameChange={handleSetNameChange} 
                  handleSetNumberChange={handleSetNumberChange} />

      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson} />

    </div>
  )
}

export default App