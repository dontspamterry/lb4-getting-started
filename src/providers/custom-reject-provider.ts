import {LogError, Reject, RejectProvider, RestBindings} from "@loopback/rest";
import {inject} from "@loopback/context";
import {ServerRequest, ServerResponse} from "http";
import {HttpError} from "http-errors";
import {AppError} from "../errors/app-error";


export class CustomRejectProvider extends RejectProvider {
    constructor(@inject(RestBindings.SequenceActions.LOG_ERROR) protected logError: LogError) {
        super(logError);
    }

    value(): Reject {
        return (response: ServerResponse, request: ServerRequest, error: Error) => {
            console.log("Hello from custom reject provider");
            const appError = AppError.fromError(error);
            const err = <HttpError>error;
            const statusCode = err.statusCode || err.status || 500;
            //writeErrorToResponse(response, err);
;
            response.setHeader('Content-Type', 'application/json');
            response.statusCode = statusCode;
            response.write(JSON.stringify(appError));
            response.end();
            this.logError(error, statusCode, request);
        };
    }
}