const { GeneralError } = require('../utils/errors');

const handleErrors = (err, req, res, next) => {
    if (err instanceof GeneralError) {
        const errCode = err.getCode();
        err['status'] = errCode.status;
        return res.status(errCode.code).json(err);
    }

    return res.status(500).json({
        status: 'UNHANDLED_ERROR',
        message: err.message,
        exception: err
    });
};

module.exports = handleErrors;