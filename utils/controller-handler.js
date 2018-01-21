const controllerHandler = (promise, status, getParams) => async (req, res, next) => {

    const params = getParams ? getParams(req, res, next) : [];
    try {
        const result = await promise(...params);
        res.status(status).json(result || {message: 'OK'});
    } catch (error){
        next(error)
    }
};

module.exports =  controllerHandler;