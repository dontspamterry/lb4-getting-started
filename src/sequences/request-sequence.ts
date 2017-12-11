import {
    inject,
} from '@loopback/core';

import {
    FindRoute,
    InvokeMethod,
    ParsedRequest,
    ParseParams,
    Reject,
    Send,
    ServerResponse,
    SequenceHandler,
    RestBindings,
} from '@loopback/rest';

import {
    AuthenticateFn,
    AuthenticationBindings,
} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

// Custom sequence to invoke the authentication at the right time during request handling
export class MySequence implements SequenceHandler {
    constructor(
        @inject(SequenceActions.FIND_ROUTE) protected findRoute: FindRoute,
        @inject(SequenceActions.PARSE_PARAMS) protected parseParams: ParseParams,
        @inject(SequenceActions.INVOKE_METHOD) protected invoke: InvokeMethod,
        @inject(SequenceActions.SEND) protected send: Send,
        @inject(SequenceActions.REJECT) protected reject: Reject,
        @inject(AuthenticationBindings.AUTH_ACTION)
        protected authenticateRequest: AuthenticateFn
    ) {}

    async handle(req: ParsedRequest, res: ServerResponse) {
        try {
            // Produce route elemwent
            const route = this.findRoute(req);

            // TODO: Is there a better way to do this? Not sure yet how to get RestServer to map different routes
            // to different sequence handlers. RestServer, presently, does not accept multiple SequenceHandlers
            let regex = new RegExp("whoami");
            if (regex.test(req.path)) {
                console.log("Request " + req.path + " requires authentication");
                // This is the important line added to the default sequence implementation
                await this.authenticateRequest(req);
            }

            // Use route element to produce args element
            const args = await this.parseParams(req, route);
            const result = await this.invoke(route, args);
            this.send(res, result);
        } catch (err) {
            console.log("error type = " + typeof(err) + ": " + err.constructor.name);
            this.reject(res, req, err);
        }
    }
}