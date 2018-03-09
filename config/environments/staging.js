
const config = (app) => {};

const variables = {
    'secret':  process.env.SECRET,
    'port': process.env.PORT,
    'database': process.env.DB
};

module.exports = {
    config: config,
    variables: variables
};
