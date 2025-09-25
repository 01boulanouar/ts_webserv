import { Request, Response, NextFunction } from "express"

export class BadRequestError extends Error {
    constructor(message: string) {
        super(message);
    }
}

export class UnauthorizedError extends Error {
    constructor(message: string) { 
        super(message);
    }
}

export class ForbiddenError extends Error {
  constructor(message: string) {
        super(message);
    }
}

export class NotFoundError extends Error {
  constructor(message: string) {
        super(message);
    }
}

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction): void {
    let statusCode = 500;
    if (err instanceof BadRequestError)
        statusCode = 400;
    if (err instanceof UnauthorizedError)
        statusCode = 401;
    if (err instanceof ForbiddenError)
        statusCode = 403;
    if (err instanceof NotFoundError)
        statusCode = 404;
    console.log(`Error: ${err.message}`);
    res.status(statusCode).json({ error: err.message });
}