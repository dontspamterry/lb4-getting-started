import {UserState} from "../models/userState";
import {RepositoryDao} from "./repository-dao";

export interface UserStateRepositoryDao extends RepositoryDao<string, UserState> {
    // Add custom repo functions here
}