class GeneralError extends Error {
    constructor(message, details, exception) {
        super();
        this.message = message;
        if (details) {
            if (Array.isArray(details)) {
                this.errors = details;
            } else {
                this.description = details;
            }
        }
        if (exception) {
            this.exception = exception;
        }
    }

    getCode() {
        return {code: 500, status: 'GENERAL_ERROR'};
    }
}

class DatabaseError extends GeneralError {
    getCode() { return {code: 500, status: 'DATABASE_ERROR'}; }
}
class DisallowedParams extends GeneralError {
    getCode() { return {code: 400, status: 'DISALLOWED_PARAMS'}; }
}
class InvalidParams extends GeneralError {
    getCode() { return {code: 400, status: 'INVALID_PARAMS'}; }
}
class InvalidRoute extends GeneralError {
    getCode() { return {code: 404, status: 'INVALID_ROUTE'}; }
}

module.exports = {
    GeneralError,
    DatabaseError,
    DisallowedParams,
    InvalidParams,
    InvalidRoute
};
