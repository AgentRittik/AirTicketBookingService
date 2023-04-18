const { StatusCodes} = require('http-status-codes')

class ValidationError extends Error{
    constructor(error){
        super();  // we call the super constructor here so that error object is created
        let explanation = [];
        error.errors.forEach((err) => {
            explanation.push(err.message);
        })
        this.name = 'ValidationError';
        this.message = 'Not able to validate the data';
        this.explanation = explanation;
        this.statusCode = StatusCodes.BAD_REQUEST
    }
}

module.exports = ValidationError;