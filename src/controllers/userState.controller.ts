

import {inject} from "@loopback/context";
import {UserState} from "../models/userState";
import {CcpDao} from "../repositories/ccp-dao";
import {get, param, post} from "@loopback/rest";
import {UserStateDao} from "../repositories/userState-dao";

export class UserStateController {
    constructor(@inject("ccp.repository.userState") private userStateRepository: UserStateDao) {
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