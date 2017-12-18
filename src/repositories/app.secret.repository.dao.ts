import {UserState} from "../models/userState";
import {RepositoryDao} from "./repository-dao";
import {AppSecret} from "../models/app.secret";

export interface AppSecretRepositoryDao extends RepositoryDao<string, AppSecret> {
    // Add custom repo functions here
}
