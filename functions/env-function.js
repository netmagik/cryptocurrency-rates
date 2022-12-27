const { crypto } = process.env.REACT_APP_API_KEY;

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    body: crypto,
  };
};