import {UserState} from "../../models/userState";
import {AttributeMap, AttributeValue, GetItemOutput} from "aws-sdk/clients/dynamodb";
import {AppSecret} from "../../models/app.secret";
import {attribute, hashKey, table} from "@aws/dynamodb-data-mapper-annotations";

@table('ccp_self_service_app_secrets_dev')
export class AppSecretDynamoDto {
    static readonly ATTR_SERVICE_ID: string = 'serviceId';
    static readonly ATTR_SECRET: string = 'secret';

    @hashKey()
    serviceId: string;

    @attribute()
    secret: string;

    public withServiceId(serviceId: string): this {
        this.serviceId = serviceId;
        return this;
    }

    public withSecret(secret: string): this {
        this.secret = secret;
        return this;
    }

    public toModel(): AppSecret {
        return new AppSecret().withServiceId(this.serviceId).withSecret(this.secret);
    }

    public static mapToModel(attributeMap: AttributeMap): AppSecret | undefined {
        let appSecret: AppSecret | undefined = undefined;
        if (attributeMap) {
            appSecret = new AppSecret();
            if (attributeMap.hasOwnProperty(AppSecretDynamoDto.ATTR_SERVICE_ID)) {
                let attributeValue: AttributeValue = attributeMap[AppSecretDynamoDto.ATTR_SERVICE_ID];
                appSecret.secretId = attributeValue.S;
            }
            if (attributeMap.hasOwnProperty(AppSecretDynamoDto.ATTR_SECRET)) {
                let attributeValue: AttributeValue = attributeMap[AppSecretDynamoDto.ATTR_SECRET];
                appSecret.secret = attributeValue.S;
            }

            for (const key of Object.getOwnPropertyNames(attributeMap)) {
                const value = attributeMap[key]
                console.log(`${key} -> ${value}`)
            }

        }
        return appSecret;
    }
}