import {get} from '@loopback/rest';
import {UserProfile, authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';

export class SecureController {
    constructor(@inject(AuthenticationBindings.CURRENT_USER) private user: UserProfile) {}

    @authenticate('BasicStrategy')
    @get('whoami')
    whoami(): string {
        return this.user.id;
    }
}