
// TODO: Quick and dirty. Need to investigate whether we can rely on the legacy juggler (there is DynamoDB adapter at
// https://github.com/tmpaul/jugglingdb-dynamodb, but the last commit was way back in Aug 1, 2014

import {RepositoryDao} from '../repository-dao';
import {UserState} from "../../models/userState";
import AWS = require('aws-sdk');
import {
    AttributeValue, GetItemInput, GetItemOutput, PutItemInput, PutItemOutput, StringAttributeValue,
    TableName
} from "aws-sdk/clients/dynamodb";
import to from "../../util/to";
import {UserStateRepositoryDao} from "../userState-repository-dao";
import {UserStateDynamoDto} from "./userState-dynamo-dto";

export class UserStateRepositoryDynamoDao implements UserStateRepositoryDao {
    private readonly tableName = "SelfServiceUserState";
    private dynamoDb: AWS.DynamoDB;

    constructor() {
        this.dynamoDb = new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            region: 'us-west-2',
            credentials: {
                accessKeyId: "ABC",
                secretAccessKey: "DEF"
            },
        });
        this.dynamoDb.endpoint = new AWS.Endpoint("http://localhost:8000");
    }

    async get(token: string): Promise<UserState | undefined> {
        let userState: UserState | undefined = undefined;
        let getItemInput: GetItemInput = {
            Key: {
                "token": {
                    S: token
                }
            },
            TableName: this.tableName
        }

        let [err, data] = await to(this.dynamoDb.getItem(getItemInput).promise());
        if (err) {
            console.log("Error retrieving: " + err);
            return undefined;
        } else {
            console.log(typeof(data));
            userState = UserStateDynamoDto.mapToModel(<GetItemOutput>data);
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
        let [err, data] = await to(this.dynamoDb.putItem(putItemInput).promise());
        if (err) {
            console.log("Error saving: " + err);
            throw new Error("Unable to save the user state for id=" + userState.ntid);
        } else {
            return userState;
        }
    }

}