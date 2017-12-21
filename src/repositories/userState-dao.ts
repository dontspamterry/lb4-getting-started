import {UserState} from "../models/userState";
import {CcpDao} from "./ccp-dao";

export interface UserStateDao extends CcpDao<string, UserState> {
    // Add custom repo functions here
}