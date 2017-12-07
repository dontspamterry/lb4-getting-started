import {
    inject,
    Provider,
    ValueOrPromise,
} from '@loopback/context';
import {
    AuthenticationBindings,
    AuthenticationMetadata,
} from '@loopback/authentication';

import {Strategy} from 'passport';
import {BasicStrategy} from 'passport-http';

// Strategy provider to map strategy names specified in @authenticate decorators into Passport Strategy instances
export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA)
        private metadata: AuthenticationMetadata,
    ) {}

    // Map strategy name to actual Strategy
    value() : ValueOrPromise<Strategy> {
        if (!this.metadata) {
            return Promise.reject('Authentication metadata not found');
        }

        const name = this.metadata.strategy;
        if (name === 'BasicStrategy') {
            return new BasicStrategy(this.verify);
        } else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    verify(username: string, password: string, cb: Function) {
        console.log("username = " + username);

        if (username === 'terry' && password === 'terryAuth') {
            // find user by name & password
            // call cb(null, false) when user not found
            // call cb(null, userProfile) when user is authenticated
            cb(null, {id: 'terry', name: 'Terry', group: 'admin'});
        } else {
            cb(null, false)
        }
    }
}