import React, {useState} from 'react';
import Select from './Select';
import './App.css';

function App() {

  const key = process.env.REACT_APP_API_KEY;

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const getPrice = async (e) => {
    if (e.key === 'Enter') {
      try {
        const response = await fetch(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${query}&to_currency=USD&apikey=${key}`);
        const data = await response.json();
        console.log(data['Realtime Currency Exchange Rate']['5. Exchange Rate']);
        setResults(parseFloat(data['Realtime Currency Exchange Rate']['5. Exchange Rate']).toLocaleString());
      }
        catch (error) {
          console.log(error);
        }
    }
  }

  const handleSearch = (data) => {
    setQuery(data);
    console.log(query);
  }


  return (
    <div className="app">
      <h1>Crypto Exchange Rate</h1>
      <Select 
        handleSearch={handleSearch}
        query={query}
        getPrice={getPrice} />
        {(results.length > 0) ? 
          <p className="results">1 {query} = <span className="emp">$ {results}</span></p> :
          ''
        }

      <p className="note"><span className="bold">Note:</span> The free tier of the stock api has a maximum of 5 requests/minute and 500 requests/day</p>
        
    </div>
  );
}

export default App;
