import { validate as Validator, ValidatorOptions } from "class-validator";
import { plainToClass } from "class-transformer";
import { ExpressError } from "./app.util";

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

export function Query(jsonObject) {
    return (req, res, next) => {
        const input = { target: req.query, jsonObject }
        return new ClientInput().validator(input, req, res, next)
    }
}

export function Body(jsonObject) {
    return (req, res, next) => {
        const input = { target: req.body, jsonObject }
        return new ClientInput().validator(input, req, res, next)
    }
}

export function Params(jsonObject) {
    return (req, res, next) => {
        const input = { target: req.params, jsonObject }
        return new ClientInput().validator(input, req, res, next)
    }
}