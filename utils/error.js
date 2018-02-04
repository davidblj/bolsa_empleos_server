const error = ( status, message, stack ) => ({
    status,
    message,
    stack
});

module.exports = error;
