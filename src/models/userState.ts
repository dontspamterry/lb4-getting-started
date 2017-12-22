import {Entity, model, property} from '@loopback/repository';


@model()
export class UserState extends Entity {
    @property({type: 'string', id: true})
    token: string;

    @property({type: 'string', required: true})
    ntid: string;

    public withToken(token: string): this {
        this.token = token;
        return this;
    }

    public withNtid(ntid: string): this {
        this.ntid = ntid;
        return this;
    }
}