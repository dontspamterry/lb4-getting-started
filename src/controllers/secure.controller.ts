import {get} from '@loopback/rest';
import {
    UserProfile, authenticate, AuthenticationBindings, AuthenticationProvider,
    AuthMetadataProvider
} from '@loopback/authentication';
import {inject} from '@loopback/core';

export class SecureController {
    constructor(@inject(AuthenticationBindings.CURRENT_USER) private user: UserProfile,
                @inject(AuthenticationBindings.AUTH_ACTION) private authAction: AuthenticationProvider,
                @inject(AuthenticationBindings.METADATA) private metaData: AuthMetadataProvider) {}

    @authenticate('BasicStrategy')
    @get('whoami')
    whoami(): string {
        return this.user.id;
    }

    @authenticate('BearerStrategy')
    @get('/testToken')
    testToken(): string {
        return `testToken authenticated for user ${this.user.id}`;
    }

}