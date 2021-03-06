
// TODO: Quick and dirty. Need evaluate investigate whether we can rely on the legacy juggler (there is DynamoDB adapter at
// https://github.com/tmpaul/jugglingdb-dynamodb, but the last commit was way back in Aug 1, 2014

import {CcpDao} from '../ccp-dao';
import {UserState} from "../../models/userState";
import AWS = require('aws-sdk');
import {
    AttributeValue, GetItemInput, GetItemOutput, PutItemInput, PutItemOutput, StringAttributeValue,
    TableName
} from "aws-sdk/clients/dynamodb";
import {UserStateDao} from "../userState-dao";
import {UserStateDynamoDto} from "./userState-dynamo-dto";
import {inject} from "@loopback/context";
import {CcpRepositoryBindings} from "../repository-bindings";
import evaluate from "../../util/evaluate";
import {AppSecretDao} from "../app.secret.dao";
import {AppSecret} from "../../models/app.secret";
import {AppSecretDynamoDto} from "./app.secret.dynamo.dto";
import {DataMapper} from "@aws/dynamodb-data-mapper";

export class AppSecretDynamoDao implements AppSecretDao {
    private readonly tableName = "ccp_self_service_app_secrets_dev";

    constructor(@inject(CcpRepositoryBindings.CLIENT) private dynamoDb: AWS.DynamoDB,
                @inject(CcpRepositoryBindings.DATA_MAPPER) private dataMapper: DataMapper) {}

    async get(serviceId: string): Promise<AppSecret | undefined> {
        let queryDto = new AppSecretDynamoDto().withServiceId(serviceId);
        let [err, data] = await evaluate(this.dataMapper.get<AppSecretDynamoDto>(queryDto));
        if (err) {
            console.log("Error retrieving: " + err);
            return undefined;
        } else {
            console.log(typeof(data));
            let appSecret = new AppSecret();
            appSecret.serviceId = data.serviceId;
            appSecret.secret = data.secret;
            return appSecret;
        }
    }

    async save(appSecret: AppSecret): Promise<AppSecret> {
        let dtoToSave = new AppSecretDynamoDto().withServiceId(appSecret.serviceId).withSecret(appSecret.secret);
        let [err, data] = await evaluate(this.dataMapper.put<AppSecretDynamoDto>(dtoToSave));
        if (err) {
            console.log("Error saving: " + err);
            throw new Error("Unable evaluate save the app secret for id=" + appSecret.serviceId);
        } else {
            return data.toModel();
        }
    }

}