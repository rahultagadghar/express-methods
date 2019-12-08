import { ExpressResponse } from "./app.interface";

export class ExpressError extends Error {
    httpStatusCode = null
    verbose = {}
    constructor(obj, code = 400, verbose = {}) {
        super(obj)
        this.httpStatusCode = code
        this.verbose = verbose
    }
}

export const attachFinishMethod = (req, res: ExpressResponse, next) => {
    res.finish = (data = {}, message = "", httpStatus = 200, errors = {}) => {
        res.status(httpStatus).send({
            message,
            data,
            errors
        });
    };
    next();
}

export const expressErrorHandler = (err: ExpressError, req, res: ExpressResponse, next) => {
    const { httpStatusCode = 400, verbose } = err
    res.finish({}, err.message, httpStatusCode, verbose);
}