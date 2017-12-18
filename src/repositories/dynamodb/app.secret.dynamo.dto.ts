import {UserState} from "../../models/userState";
import {AttributeMap, AttributeValue, GetItemOutput} from "aws-sdk/clients/dynamodb";
import {AppSecret} from "../../models/app.secret";

export class AppSecretDynamoDto {
    static readonly ATTR_SERVICE_ID: string = 'serviceId';
    static readonly ATTR_SECRET: string = 'secret';

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