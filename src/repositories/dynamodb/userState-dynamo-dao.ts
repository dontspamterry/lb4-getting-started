
// TODO: Quick and dirty. Need evaluate investigate whether we can rely on the legacy juggler (there is DynamoDB adapter at
// https://github.com/tmpaul/jugglingdb-dynamodb, but the last commit was way back in Aug 1, 2014

import {UserState} from "../../models/userState";
import {GetItemInput, GetItemOutput, PutItemInput} from "aws-sdk/clients/dynamodb";
import {UserStateDao} from "../userState-dao";
import {UserStateDynamoDto} from "./userState-dynamo-dto";
import {inject} from "@loopback/context";
import {CcpRepositoryBindings} from "../repository-bindings";
import evaluate from "../../util/evaluate";
import {DataMapper} from "@aws/dynamodb-data-mapper";
import AWS = require('aws-sdk');

export class UserStateDynamoDao implements UserStateDao {
    private readonly tableName = "ccp_self_service_auth_dev";

    constructor(@inject(CcpRepositoryBindings.CLIENT) private dynamoDb: AWS.DynamoDB,
                @inject(CcpRepositoryBindings.DATA_MAPPER) private dataMapper: DataMapper) {}

    async get(token: string): Promise<UserState | undefined> {
        let userState: UserState | undefined = undefined;
        // TODO: Can we read that token field as a static string in the UserStateDynamoDto?
        let getItemInput: GetItemInput = {
            Key: {
                "token": {
                    S: token
                }
            },
            TableName: this.tableName
        }

        let queryDto: UserStateDynamoDto = new UserStateDynamoDto().withToken(token);
        let [err, data] = await evaluate(this.dataMapper.get<UserStateDynamoDto>(queryDto));
        if (err) {
            console.log("Error retrieving: " + err);
            return undefined;
        } else {
            console.log(typeof(data));
            //userState = UserStateDynamoDto.mapToModel((<GetItemOutput>data).Item);
            userState = data.toModel();
            return userState;
        }
    }

    async save(userState: UserState): Promise<UserState> {
        let putItemInput: PutItemInput = {
            Item: {
                "token": {
                    S: userState.token
                },
                "ntid": {
                    S: userState.ntid
                }
            },
            ReturnConsumedCapacity: "TOTAL",
            TableName: this.tableName
        }

        const userStateDto: UserStateDynamoDto = new UserStateDynamoDto()
            .withToken(userState.token)
            .withNtid(userState.ntid);

        let [err, data] = await evaluate(this.dataMapper.put<UserStateDynamoDto>(userStateDto));
        if (err) {
            console.log("Error saving: " + err);
            throw new Error("Unable evaluate save the user state for id=" + userState.ntid);
        } else {
            return data.toModel();
        }
    }

}