import * as createHttpError from 'http-errors';
import {ServerRequest, ServerResponse} from "http";

//type HttpError = createHttpError.HttpError;

// TODO: maybe extends Error
export class AppError {
    constructor(private errorCode: number, private type: string, private details: string, private timestamp: Date) {
    }

    get getErrorCode(): number {
        return this.errorCode;
    }

    get getType(): string {
        return this.type;
    }

    get getDetails(): string {
        return this.details;
    }

    get getTimestamp(): Date {
        return this.timestamp;
    }

    public static fromError(error: Error): AppError {
        let now = new Date();
        if (error instanceof createHttpError.HttpError) {
            let httpError = <createHttpError.HttpError>error;
            return new AppError(httpError.statusCode, "HTTP", httpError.message, now);
        } else {
            return new AppError(-1, "UNKNOWN", error.message, now);
        }
    }
}
