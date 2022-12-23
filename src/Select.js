import React from "react";

const Select = ({
  handleSearch,
  getPrice,
  suggestions
}) => {

  return (
    <div>
      <form onSubmit={getPrice}>
        <label htmlFor="search">Enter Cryptocurrency Symbol:</label>
        <input 
            name="search" 
            type="text" 
            suggestions={suggestions}
            onChange={handleSearch} />
      </form>
    </div>
  );
};

export default Select;
