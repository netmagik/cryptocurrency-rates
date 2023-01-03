import React, { useState } from "react";
import "./App.css";
import ErrorComponent from "./ErrorComponent";

function App() {

  const [query, setQuery] = useState("");
  const [results, setResults] = useState({
    rate: "",
    date: "",
    description: "",
    toCurrency: "",
  });
  const [active, setActive] = useState(0);
  const [filtered, setFiltered] = useState([]);
  const [isShow, setIsShow] = useState(false);
  const [error, setError] = useState(false);

  // Get Symbols for Autocomplete
  const symbols = require("./symbols.json");

  // Get Price
  const getPrice = async () => {
    try {
      const response = await fetch(
        `/.netlify/functions/env-function?query=${query}`
      );
      const data = await response.json();
      if (data !== undefined) {
        setResults({
          rate: parseFloat(
            data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]
          ).toLocaleString(),
          date: data["Realtime Currency Exchange Rate"]["6. Last Refreshed"],
          description:
            data["Realtime Currency Exchange Rate"]["2. From_Currency Name"],
          toCurrency:
            data["Realtime Currency Exchange Rate"]["4. To_Currency Name"],
        });
      } else setError({ error: "Invalid API Call" });
    } catch (error) {
      console.log(`Error Message: ${error}`);
      setError(true);
    }
  };

  const onChange = (e) => {
    // Map symbols.json to show currency code - description
    const data = symbols.map(
      (obj) => `${obj["currency code"]} - ${obj["currency name"]}`
    );
    const input = e.currentTarget.value.toUpperCase();
    // Filter through the codes to create suggestions
    const newFilteredSuggestions = data.filter(
      (suggestion) => suggestion.toString().toUpperCase().indexOf(input) > -1
    );

    setActive(0);
    setResults({});
    setFiltered(newFilteredSuggestions);
    setIsShow(true);
    setQuery(e.currentTarget.value);
  };

  const onClick = (e) => {
    setActive(0);
    setFiltered([]);
    setIsShow(false);
    setQuery(
      e.currentTarget.innerText.substring(
        0,
        e.currentTarget.innerText.indexOf(" ")
      )
    );
    setError(false);
    getPrice();
  };

  const onKeyDown = (e) => {
    if (e.keyCode === 13) {
      // enter key
      setActive(0);
      setIsShow(false);
      let code = filtered[active]?.substring(0, filtered[active].indexOf(" "));
      setQuery(code);
      getPrice();
    } else if (e.keyCode === 38) {
      // up arrow
      return active === 0 ? null : setActive(active - 1);
    } else if (e.keyCode === 40) {
      // down arrow
      return active - 1 === filtered.length ? null : setActive(active + 1);
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
            <p className="emp"> Not found</p>
          </div>
        );
      }
    }
    return <></>;
  };

  return (
    <div className="app">
      <h1>Digital Currency Exchange Rate</h1>
      <p>Enter Crypto Symbol to get current exchange rate to USD</p>

      {/* Show Input Box */}
      <input
        type="text"
        autoFocus
        onChange={onChange}
        onKeyDown={onKeyDown}
        value={query || ""}
      />
      {renderAutocomplete()}

      {error ? (
        <ErrorComponent></ErrorComponent>
      ) : results.rate ? (
        <div className="results">
          <p className="rate">
            1 {query} = ${results.rate}
          </p>
          <p className="emp">
            {results.description} to: {results.toCurrency}
          </p>
          <p>Last Refreshed: {results.date}</p>
        </div>
      ) : (
        ""
      )}

      <p className="note">
        <span className="emp">Note:</span> The free tier of the stock api has a
        maximum of 5 requests/minute and 500 requests/day
      </p>
    </div>
  );
}

export default App;
