import { config } from 'dotenv'
config()
import express, { NextFunction } from 'express'
const app = express();
import httpError from 'http-errors'
import { attachFinishMethod, expressErrorHandler, ExpressError } from './app.util';
import { ExpressResponse } from './app.interface';
import { validateQuery } from './app.middleware';
import { User } from './app.dto';
const { log } = console;
const port = process.env.PORT;
app.listen(port, () => log("server on : ", port));

/* 
    INFO : attachFinishMethod callback attaches finish method (req.finish) to every incoming request  
*/
app.use(attachFinishMethod);

app.get("/", (req, res: ExpressResponse, next) => {
    try {
        /* 
            INFO : Message as second argument is optional
        */
        const result = {
            isUser: true,
        }
        /* 
            INFO : 
                    * 200 is default success http statusCode for get method
                    * 201 is default success http statusCode for rest of the methods 
                    * 400 is default failure http statusCode for all methods
        */
        res.finish(result, "Fetched mock user info!");
    } catch (error) {
        next(error);
    }
});

app.get("/mockErrorPath", (req, res: ExpressResponse, next) => {
    try {
        /* 
            INFO : statusCode as second argument is optional by default it is 400
                   try custom message and statusCode in ExpressError
        */
        throw new ExpressError("Its Forbidden", 403)
    } catch (error) {
        next(error);
    }
});

app.get("/mockErrorPathHttp", (req, res: ExpressResponse, next) => {
    try {
        /* 
            INFO : If your a fan of http-errors like me :) go ahead!
        */
        throw new httpError.Forbidden()
    } catch (error) {
        next(error);
    }
});


app.get('/validator', validateQuery.bind(User), (req, res: ExpressResponse, next) => {
    try {
        const result = { done: true }
        res.finish(result, "All validation passed")
    } catch (error) {
        next(error)
    }
})


/* 
    INFO : Standard error handler,
           When we execute next() from api it is passed to next middleware 
           which is in our case expressErrorHandler and request is terminated !
*/
app.use(expressErrorHandler);
