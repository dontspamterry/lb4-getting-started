import {inject} from "@loopback/context";
import {CcpRepositoryBindings} from "../repositories/repository-bindings";
import {AppSecretDao} from "../repositories/app.secret.dao";
import {get, param, post} from "@loopback/rest";
import {AppSecret} from "../models/app.secret";

export class AppSecretController {
    constructor(@inject(CcpRepositoryBindings.APP_SECRET_REPO) private appSecretDao: AppSecretDao) {
    }

    @get('/appSecret/{serviceId}')
    @param.path.string('serviceId')
    get(serviceId: string): Promise<AppSecret | undefined> {
        return this.appSecretDao.get(serviceId);
    }

    @post('/appSecret')
    @param.body('appSecret', AppSecret)
    save(appSecret: AppSecret): Promise<AppSecret> {
        return this.appSecretDao.save(appSecret);
    }
}