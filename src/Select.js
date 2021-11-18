import React from 'react';

const Select = (props) => {

    const handleChange = (e) => {
        props.handleSearch(e.target.value);
    }
    return (
        <div>
            <label htmlFor="search">Enter Cryptocurrency Symbol:</label>
        <input 
            name="search"
            type="text" 
            value={props.query} 
            onChange={handleChange}
            onKeyPress={props.getPrice}
        />
        </div>
    );
}

export default Select;