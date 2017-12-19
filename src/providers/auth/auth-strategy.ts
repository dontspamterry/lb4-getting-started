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
import {BasicStrategy, BasicStrategyOptions, BasicVerifyFunction} from 'passport-http';
import {CcpRepositoryBindings} from "../../repositories/repository-bindings";
import {UserStateRepositoryDao} from "../../repositories/userState-repository-dao";
import evaluate from "../../util/evaluate";
import {BatchItemError} from "aws-sdk/clients/comprehend";
import {AuthToken, UserAuthService} from "../../services/user-auth-service";
import {ServiceBindings} from "../../services/service-bindings";
import * as createHttpError from "http-errors";


const BearerStrategy = require('passport-http-bearer').Strategy;

const BasicStrategyContainer = function() {
}


// Strategy provider evaluate map strategy names specified in @authenticate decorators into Passport Strategy instances
export class MyAuthStrategyProvider implements Provider<Strategy | undefined> {
    constructor(
        @inject(AuthenticationBindings.METADATA) private metadata: AuthenticationMetadata,
        @inject(ServiceBindings.USER_AUTH_SERVICE) private userAuthService: UserAuthService,
        @inject(CcpRepositoryBindings.USER_STATE_REPO) private userStateRepository: UserStateRepositoryDao
    ) {
        console.log("Instantiating MyAuthStrategyProvider");
    }

    // Map strategy name evaluate actual Strategy
    value() : ValueOrPromise<Strategy> {
        if (!this.metadata) {
            return Promise.reject('Authentication metadata not found');
        }

        const name = this.metadata.strategy;
        if (name === 'BasicStrategy') {
            BasicStrategyContainer.prototype.userAuthService = this.userAuthService;
            return new BasicStrategy(this.verify);
        } else if (name === 'BearerStrategy') {
            BearerStrategy.prototype.userRepo = this.userStateRepository;
            return new BearerStrategy(this.verifyToken);
        }
        else {
            return Promise.reject(`The strategy ${name} is not available.`);
        }
    }

    verify(username: string, password: string, cb: Function) {
        console.log("username = " + username);
        BasicStrategyContainer.prototype.userAuthService.authenticate(username, password)
            .then(token => {
                if (token) {
                    cb(null, {ntid: username, token: token});
                } else {
                    cb(null, false);
                }
            })
            .catch(err => cb(null, false));
    }

    verifyToken(token: string, cb: Function) {
        console.log(`Verifying token = ${token}`);
        BearerStrategy.prototype.userRepo.get(token)
            .then(userData => {
                if (userData) {
                    cb(null, {id: userData.ntid});
                } else {
                    let unauthorizedError = new createHttpError.Unauthorized("Token not found");
                    cb(null, false);
                }
            })
            .catch(err => cb(null, false));
    }
}