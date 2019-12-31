import { ExpressResponse } from "./app.interface";
import { Request } from "express";

export enum httpMethod {
    GET = "GET"
}

export class ExpressError extends Error {
    statusCode = null
    verbose = {}
    constructor(obj, code = 400, verbose = {}) {
        super(obj)
        this.statusCode = code
        this.verbose = verbose
    }
}

export const attachFinishMethod = (req: Request, res: ExpressResponse, next) => {
    let defaultHttpStatus = 200
    
    if (req.method !== httpMethod.GET) {
        defaultHttpStatus = 201
    }

    res.finish = (data = {}, message = "", httpStatus = defaultHttpStatus, errors = {}) => {
        res.status(httpStatus).send({
            message,
            data,
            errors
        });
    };
    next();
}

export const expressErrorHandler = (err: ExpressError, req, res: ExpressResponse, next) => {
    const { statusCode = 400, verbose } = err
    res.finish({}, err.message, statusCode, verbose);
}