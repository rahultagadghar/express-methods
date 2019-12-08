# Express Methods

This project is build in TypeScript, demonstrates standard usage of express framework with advance custom request methods and error generators

**Run application in Production mode**

```npm
    npm start
```

**Run application in Development mode** [ Configured with Nodemon ]

```npm
    npm run dev
```

## Finish Method

Finish method makes use of send method under the hood, finish method allows to send http response in a uniform pattern for all the APIS including success and failure response

```ts
const attachFinishMethod = (req: Request, res: ExpressResponse, next) => {
  let defaultHttpStatus = 200;

  if (req.method !== httpMethod.GET) {
    defaultHttpStatus = 201;
  }

  res.finish = (data = {}, message = "", httpStatus = defaultHttpStatus, errors = {}) => {
    res.status(httpStatus).send({
      message,
      data,
      errors
    });
  };
  next();
};
```

Make sure to add this middleware on highest scope of application, this will make sure to attach finish method to every request

```ts
app.use(attachFinishMethod);
```

Example for usage of finish method

```ts
app.get("/", (req, res: ExpressResponse, next) => {
  try {
    const result = {
      isUser: true
    };
    res.finish(result, "Fetched mock user info!");
  } catch (error) {
    next(error);
  }
});
```

# Error Generators

ExpressError is build on top of Error constructor it adds ability to send custom http message and status code

```ts
throw new ExpressError("Its Forbidden", 403);
```

```ts
throw new httpError.Forbidden();
```

Make sure to place this middleware at the end of scope, this middleware is compatible with both the error generators shown above

```ts
app.use(expressErrorHandler);
```
