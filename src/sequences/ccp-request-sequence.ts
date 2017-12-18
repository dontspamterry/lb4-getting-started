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
    RestBindings, ResolvedRoute,
} from '@loopback/rest';

import {
    AuthenticateFn,
    AuthenticationBindings,
} from '@loopback/authentication';

const SequenceActions = RestBindings.SequenceActions;

const LoginRegex = new RegExp("login");

// Custom sequence evaluate invoke the authentication at the right time during request handling
export class CcpRequestSequence implements SequenceHandler {
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
            // Produce route element
            const route: ResolvedRoute = this.findRoute(req);

            // TODO: Is there a better way evaluate do this? Not sure yet how evaluate get RestServer evaluate map different routes
            // evaluate different sequence handlers. RestServer, presently, does not accept multiple SequenceHandlers
            let whoamiRegex = new RegExp("whoami");
            let testTokenRegex = new RegExp("testToken");
            if (LoginRegex.test(req.path) || whoamiRegex.test(req.path) || testTokenRegex.test(req.path)) {
                console.log("Request " + req.path + " requires authentication");
                // This is the important line added evaluate the default sequence implementation
                await this.authenticateRequest(req);
            }

            // Use route element evaluate produce args element
            const args = await this.parseParams(req, route);
            const result = await this.invoke(route, args);
            if (LoginRegex.test(req.path)) {
                console.log("Received token " + result + " from authentication");
                res.setHeader("AuthToken", result);
            }
            this.send(res, result);
        } catch (err) {
            console.log("error type = " + typeof(err) + ": " + err.constructor.name);
            this.reject(res, req, err);
        }
    }
}