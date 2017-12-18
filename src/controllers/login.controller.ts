import {get} from '@loopback/rest';
import {UserProfile, authenticate, AuthenticationBindings} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {UserAuthService} from "../services/user-auth-service";

/**
 * Augment UserProfile to include a token
 */
interface ExtendedUserProfile extends UserProfile {
    token: string;
}

export class LoginController {
    constructor(@inject(AuthenticationBindings.CURRENT_USER) private user: UserProfile) {}

    @authenticate('BasicStrategy')
    @get('/login')
    login(): string {
        let enhancedUser: ExtendedUserProfile = <ExtendedUserProfile>this.user;
        return enhancedUser.token;
    }
}
