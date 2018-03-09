
const config = (app) => {};

const variables = {
    'secret':  process.env.SECRET,
    'port': process.env.PORT,
    'database': process.env.DB,
    'origin': 'https://bolsa-de-empleos-client.herokuapp.com'
};

module.exports = {
    config: config,
    variables: variables
};
