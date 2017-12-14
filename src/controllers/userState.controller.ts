

import {inject} from "@loopback/context";
import {UserState} from "../models/userState";
import {RepositoryDao} from "../repositories/repository-dao";
import {get, param, post} from "@loopback/rest";
import {UserStateRepositoryDao} from "../repositories/userState-repository-dao";

export class UserStateController {
    constructor(@inject("ccp.userState.repository") private userStateRepository: UserStateRepositoryDao) {
    }

    @get('/userState/{token}')
    @param.path.string('token')
    getUserState(token: string): Promise<UserState | undefined> {
        return this.userStateRepository.get(token);
    }

    @post('/userState')
    @param.body('userState', UserState)
    upsertUserState(userState: UserState): Promise<UserState> {
        return this.userStateRepository.save(userState);
    }
}