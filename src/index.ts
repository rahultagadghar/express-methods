import { config } from 'dotenv'
config()
import express, { NextFunction } from 'express'
const app = express();
import httpError from 'http-errors'
import { attachFinishMethod, expressErrorHandler, ExpressError } from './app.util';
import { ExpressResponse } from './app.interface';
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

        res.finish(result, "Fetched User Info!");
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
            INFO : If you are fan of http-errors like me :) go ahead!
        */
        throw new httpError.Forbidden()
    } catch (error) {
        next(error);
    }
});

/* 
    INFO : Standard error handler,
           When we execute next() from api it is passed to next middleware 
           which is in our case expressErrorHandler and request is terminated !
*/
app.use(expressErrorHandler);
