import {AppSecretDao} from "../app.secret.dao";
import {AppSecret} from "../../models/app.secret";

export class AppSecretLocalDao implements AppSecretDao {

    private serviceMap: Map<string, AppSecret> = new Map();

    async get(serviceId: string): Promise<AppSecret | undefined> {
        if (this.serviceMap.has(serviceId)) {
            return Promise.resolve(this.serviceMap.get(serviceId));
        } else {
            return Promise.reject(new Error(`Service ID ${serviceId} not found`));
        }
    }

    async save(appSecret: AppSecret): Promise<AppSecret> {
        this.serviceMap.set(appSecret.serviceId, appSecret);
        return Promise.resolve(appSecret);
    }
}