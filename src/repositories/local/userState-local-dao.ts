import {UserStateDao} from "../userState-dao";
import {UserState} from "../../models/userState";

export class UserStateLocalDao implements UserStateDao {

    private tokenMap: Map<string, UserState> = new Map();

    async get(token: string): Promise<UserState | undefined> {
        if (this.tokenMap.has(token)) {
            return Promise.resolve(this.tokenMap.get(token));
        } else {
            return Promise.reject(new Error(`Token ${token} not found`));
        }
    }

    async save(userState: UserState): Promise<UserState> {
        this.tokenMap.set(userState.token, userState);
        return Promise.resolve(userState);
    }
}