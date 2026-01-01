export class HttpError extends Error {
    status: number;
    constructor(status: number, message:string) {
        super(message);
        this.status = status;
    }
}

export const badRequest = (message = "Bad request") => new HttpError(400, message);
export const notFound = (message = "Not found") => new HttpError(404, message);