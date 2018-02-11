/**
 * Handles an API request. If the input "promise" throws an error, a middleware will take control.
 * @module controller-handler
 *
 * @function
 * @param {function} promise - a function defined on the "controllers" folder to process this request
 * @param {number} status - an integer expressing the status of the response (only if the "promise" input resolves successfully)
 * @param {function} [getParams] - a function that returns an array of parameters to be process by "promise"
 *
 * @example
 * getJob(id) // a controller that needs an id to retrieve a job, and goes by this definition
 * ...
 * controllerHandler(getJob, 200, (req, res, next) => req.id) // controller-handler is a variable that has been exported and named as "controllerHandler"
 */
module.exports = (promise, status, getParams) => async (req, res, next) => {

    const params = getParams ? getParams(req, res, next) : [];
    try {
        const result = await promise(...params);
        res.status(status).json(result || {message: 'OK'});
    } catch (error) {
        next(error)
    }
};
