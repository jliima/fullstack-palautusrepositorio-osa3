import React from 'react'

const Persons = ({persons, filter, deletePerson}) => {
    const renderPersons = (persons) => (
      <>
        {persons.map((person, id) => 
          <div key={id}>
            {person.name} {person.number} <button onClick={() => deletePerson(person.id)}>delete</button>
          </div>
        )}
      </>
    )
    
    if (filter === '') {
      return renderPersons(persons)
    }
  
    const filteredPersons = []
  
    persons.forEach((person) => {
      if (person.name.toLowerCase().includes(filter.toLowerCase())) {
        filteredPersons.push(person)
      }
    })
  
    return renderPersons(filteredPersons)
  }

export default Persons