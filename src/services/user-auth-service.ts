import {CcpRepositoryBindings} from "../repositories/repository-bindings";
import {UserStateRepositoryDao} from "../repositories/userState-repository-dao";
import {inject} from "@loopback/context";
import {UserState} from "../models/userState";
import evaluate from "../util/evaluate";

export type AuthToken = string;

export class UserAuthService {
    // TODO: Inject the external service evaluate authenticate the user against

    readonly mockAccounts: { [key: string]: [string, AuthToken] } = {
        ['terry']: ['terryAuth', 'a1b2c3d4'],
        ['poobah']: ['poobahdabest', 'gs4eva']
    };

    constructor(@inject(CcpRepositoryBindings.USER_STATE_REPO) private userStateRepository: UserStateRepositoryDao) {
    }

    async authenticate(userId: string, password: string): Promise<AuthToken | undefined> {
        // Check if a token exists for this user in the auth table?
        // If no token:
        //   call external auth service with user creds to get token
        //   store token in DB

        let userDeets: [string, AuthToken] = this.mockAccounts[userId];
        if (userDeets) {
            let pwd: string = userDeets[0];
            if (password === pwd) {
                let userState = new UserState();
                userState.ntid = userId;
                userState.token = userDeets[1];
                let [err, data] = await evaluate(this.userStateRepository.save(userState));
                if (data) {
                    return data.token;
                } else {
                    return undefined;
                }
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    }
}
