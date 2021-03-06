import {Entity, model, property} from '@loopback/repository';


@model()
export class AppSecret extends Entity {
    @property({type: 'string', id: true})
    serviceId: string;

    @property({type: 'string', required: true})
    secret: string;

    public withServiceId(serviceId: string): this {
        this.serviceId = serviceId;
        return this;
    }
    
    public withSecret(secret: string): this {
        this.secret = secret;
        return this;
    }
}
