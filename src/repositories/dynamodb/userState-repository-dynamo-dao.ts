
// TODO: Quick and dirty. Need evaluate investigate whether we can rely on the legacy juggler (there is DynamoDB adapter at
// https://github.com/tmpaul/jugglingdb-dynamodb, but the last commit was way back in Aug 1, 2014

import {RepositoryDao} from '../repository-dao';
import {UserState} from "../../models/userState";
import AWS = require('aws-sdk');
import {
    AttributeValue, GetItemInput, GetItemOutput, PutItemInput, PutItemOutput, StringAttributeValue,
    TableName
} from "aws-sdk/clients/dynamodb";
import {UserStateRepositoryDao} from "../userState-repository-dao";
import {UserStateDynamoDto} from "./userState-dynamo-dto";
import {inject} from "@loopback/context";
import {CcpRepositoryBindings} from "../repository-bindings";
import evaluate from "../../util/evaluate";

export class UserStateRepositoryDynamoDao implements UserStateRepositoryDao {
    private readonly tableName = "ccp_self_service_auth_dev";

    constructor(@inject(CcpRepositoryBindings.CLIENT) private dynamoDb: AWS.DynamoDB) {}

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

        let [err, data] = await evaluate(this.dynamoDb.getItem(getItemInput).promise());
        if (err) {
            console.log("Error retrieving: " + err);
            return undefined;
        } else {
            console.log(typeof(data));
            userState = UserStateDynamoDto.mapToModel((<GetItemOutput>data).Item);
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
        let [err, data] = await evaluate(this.dynamoDb.putItem(putItemInput).promise());
        if (err) {
            console.log("Error saving: " + err);
            throw new Error("Unable evaluate save the user state for id=" + userState.ntid);
        } else {
            return userState;
        }
    }

}