import {Strategy} from "passport";
import {inject, Provider, ValueOrPromise} from "@loopback/context";
import {AuthenticationBindings, AuthenticationMetadata} from "@loopback/authentication";
import {ServiceBindings} from "../../services/service-bindings";
import {UserAuthService} from "../../services/user-auth-service";
import {BasicStrategy} from "passport-http";

const BearerStrategy = require('passport-http-bearer').Strategy;

export class FakeAuthStrategyProvider implements Provider<Strategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
    ) {}

    // Map strategy name evaluate actual Strategy
    value() : ValueOrPromise<Strategy> {
        if (!this.metadata) {
            return Promise.reject('Authentication metadata not found');
        }

        const name = this.metadata.strategy;
        if (name === 'BasicStrategy') {
            return new BasicStrategy(this.verifyUserNamePassword);
        } else if (name === 'BearerStrategy') {
            return new BearerStrategy(this.verifyToken);
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    verifyUserNamePassword(username: string, password: string, cb: Function) {
        console.log("username = " + username);
        cb(null, {ntid: username, token: "fakeToken"});
    }

    verifyToken(token: string, cb: Function) {
        console.log(`Verifying token = ${token}`);
        cb(null, {id: "fakeId"});
    }
}