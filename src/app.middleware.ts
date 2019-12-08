import { validate as Validator, ValidatorOptions } from "class-validator";
import { plainToClass } from "class-transformer";
import { ExpressError } from "./app.util";

/* 
    INFO :
            *  ClientInput middleware converts incoming object to class instance 
            *  Compares class instance to provided reference class
            *  Maps error message to readable form
            *  Terminates request on error else transfer request to next middleware on success 
*/

class ClientInput {

    private mapErrorMessages(o) {
        return {
            property: o.property, constraints: Object.values(o.constraints)
        }
    }

    async validator(input, req, res, next) {
        try {
            const { target, jsonObject } = input
            const classInstance = plainToClass(jsonObject, target);
            const result = await Validator(classInstance, { validationError: { target: false } })
            if (!result.length) {
                return next()
            }
            const allErrorMessages = result.map(this.mapErrorMessages)
            throw new ExpressError("Invalid request", 400, allErrorMessages)
        } catch (error) {
            next(error)
        }
    }
}

export function validateQuery(req, res, next) {
    const input = { target: req.query, jsonObject: this }
    return new ClientInput().validator(input, req, res, next)
}
export function validateBody(req, res, next) {
    const input = { target: req.body, jsonObject: this }
    return new ClientInput().validator(input, req, res, next)
}
export function validateParams(req, res, next) {
    const input = { target: req.params, jsonObject: this }
    return new ClientInput().validator(input, req, res, next)
}