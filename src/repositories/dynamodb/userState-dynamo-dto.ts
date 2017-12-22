import {UserState} from "../../models/userState";
import {AttributeMap, AttributeValue, GetItemOutput} from "aws-sdk/clients/dynamodb";
import {attribute, hashKey, table} from "@aws/dynamodb-data-mapper-annotations";

interface LooseObject {
    [key: string]: string | number | LooseObject;
}

@table('ccp_self_service_auth_dev')
export class UserStateDynamoDto {
    static readonly ATTR_TOKEN: string = 'token';
    static readonly ATTR_NTID: string = 'ntid';

    @hashKey()
    token: string;

    @attribute()
    ntid: string;

    /* TODO: May have evaluate declare our own Item type, e.g.
    {
    "Item": {
        "token": {
            "S": "a1b2c3d4"
        },
        "ntid": {
            "S": "terry"
        }
    }
    }
    */

    public withToken(token: string): this {
        this.token = token;
        return this;
    }

    public withNtid(ntid: string): this {
        this.ntid = ntid;
        return this;
    }

    public toModel(): UserState {
        return new UserState({
            token: this.token,
            ntid: this.ntid
        });
    }


    public static mapToModel(attributeMap: AttributeMap): UserState | undefined {
        let userState: UserState | undefined = undefined;
        if (attributeMap) {
            userState = new UserState();
            if (attributeMap.hasOwnProperty(UserStateDynamoDto.ATTR_NTID)) {
                let attributeValue: AttributeValue = attributeMap[UserStateDynamoDto.ATTR_NTID];
                userState.ntid = attributeValue.S;
            }
            if (attributeMap.hasOwnProperty(UserStateDynamoDto.ATTR_TOKEN)) {
                let attributeValue: AttributeValue = attributeMap[UserStateDynamoDto.ATTR_TOKEN];
                userState.token = attributeValue.S;
            }

            for (const key of Object.getOwnPropertyNames(attributeMap)) {
                const value = attributeMap[key]
                console.log(`${key} -> ${value}`)
            }

        }
        return userState;
    }
}