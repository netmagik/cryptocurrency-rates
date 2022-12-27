const fetch = require("node-fetch");
//const BASE_URL = "https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${query}&to_currency=USD&apikey=${key}";
const BASE_URL = "https://www.alphavantage.co/";

exports.handler = async (event, context) => {
  // Access the environment variables using process.env
  try {
    const { query } = event.queryStringParameters;
    return fetch(
      `${BASE_URL}/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${query}&to_currency=USD&apikey=${process.env.API_KEY}`
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response not ok");
        }
        return response.json();
      })
      .then((json) => {
        return {
          statusCode: 200,
          body: JSON.stringify(json),
        };
      });
  } catch (error) {
    return {
      statusCode: 404,
      body: error.toString(),
    };
  }
};
