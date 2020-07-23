import React from 'react'

const Filter = ({filter, setFilter, handleFilterChange}) => (
    <form onSubmit={setFilter}>
        <div>filter shown with
          <input
            value={filter}
            onChange={handleFilterChange}
          />
        </div>
    </form> 
)

export default Filter