import React from 'react'

const PersonForm = ({newName, newNumber, addPerson, 
    handleSetNameChange, handleSetNumberChange}) => (
    <form onSubmit={addPerson}>
        <div>name:
            <input
                value={newName}
                onChange={handleSetNameChange}
            />
        </div>

        <div>number:
            <input
                value={newNumber}
                onChange={handleSetNumberChange}
            />
        </div>

        <div>
            <button type='submit'>add</button>
        </div>

    </form>
)

export default PersonForm