import React, { useState } from "react";
import "./App.css";


function App() {
  const key = process.env.REACT_APP_API_KEY;

  const [query, setQuery] = useState("");
  const [results, setResults] = useState('');
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);

  // Get Symbols for Autocomplete
  const symbols = require('./symbols.json')

// Get Price
  const getPrice = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${query}&to_currency=USD&apikey=${key}`
      );
      const data = await response.json();
      setResults(parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']).toLocaleString());
    } catch (error) {
      console.log(error);
    }
  };

const onChange = e => {
  const data = symbols.map(obj => `${obj["currency code"]} - ${obj["currency name"]}`)
  const input = (e.currentTarget.value).toUpperCase();

  // Filter through the codes to create suggestions
  const newFilteredSuggestions = data.filter(
    suggestion =>
      suggestion.toString().toUpperCase().indexOf(input) > -1
  );
console.log(newFilteredSuggestions)
  setActive(0);
  setFiltered(newFilteredSuggestions);
  setIsShow(true);
  setQuery(e.currentTarget.value)
};

const onClick = e => {
  setActive(0);
  setFiltered([]);
  setIsShow(false);
  setQuery(e.currentTarget.innerText)
};


const onKeyDown = e => {
  if (e.keyCode === 13) { // enter key
    setActive(0);
    setIsShow(false);
    setQuery(filtered[active])
  }
  else if (e.keyCode === 38) { // up arrow
    return (active === 0) ? null : setActive(active - 1);
  }
  else if (e.keyCode === 40) { // down arrow
    return (active - 1 === filtered.length) ? null : setActive(active + 1);
  }
};

const renderAutocomplete = () => {
  if (isShow && query) {
    if (filtered.length) {
      return (
        <ul className="autocomplete">
          {filtered.map((suggestion, index) => {
            let className;
            if (index === active) {
              className = "active";
            }
            return (
              <li className={className} key={suggestion} onClick={onClick}>
                {suggestion}
              </li>
            );
          })}
        </ul>
      );
    } else {
      return (
        <div className="no-autocomplete">
          <em>Not found</em>
        </div>
      );
    }
  }
  return <></>;
}  


  return (
    <div className="app">
      <h1>Crypto Exchange Rate</h1>
      <input
        type="text"
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={query}
      />
      {renderAutocomplete()}

      {results && <h2>${results}</h2>}
      {results && <p className="results">1 {query} = <span className="emp">${results}</span></p>}

      <p className="note">
        <span className="bold">Note:</span> The free tier of the stock api has a
        maximum of 5 requests/minute and 500 requests/day
      </p>
    </div>
  );
}

export default App;
