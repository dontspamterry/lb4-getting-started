import {UserState} from "../models/userState";
import {CcpDao} from "./ccp-dao";
import {AppSecret} from "../models/app.secret";

export interface AppSecretDao extends CcpDao<string, AppSecret> {
    // Add custom repo functions here
}
