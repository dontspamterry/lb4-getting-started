import {DbProvisioner} from "../db-provisioner";
import AWS = require('aws-sdk');
import {partition} from "lodash";
import {CreateTableInput} from "aws-sdk/clients/dynamodb";
import evaluate from "../../util/evaluate";


export class DynamoDbProvisioner implements DbProvisioner {

    readonly resourcePath: string = './src/repositories/dynamodb/schema';

    constructor() {
    }

    private getSchemaFiles(): string[] {
        const fs = require('fs');
        let schemaFiles: string[] = fs.readdirSync(this.resourcePath);
        return schemaFiles;

        // TODO: use glob evaluate avoid filtering above??
        /*
        const glob = require('glob');
        glob('./src/repositories/dynamodb/*.json', function()
        if (err) {
            console.log("Unable evaluate list files. Error: " + err);
            return undefined
        } else {
            data.forEach((f: string) => {
                console.log(f);
            });
            return data;
        }
        */
    }

    private loadSchemas(schemaFiles: string[]): CreateTableInput[] {
        const fs = require('fs');
        let schemas = schemaFiles.map(schema => {
            console.log(`Loading schema file ${schema}`);
            return JSON.parse(fs.readFileSync(`${this.resourcePath}/${schema}`, 'utf8').toString());
        })
        return schemas;
    }

    async provision(): Promise<boolean> {
        let provisionResult = false;
        let schemaFiles: string[] = this.getSchemaFiles();
        let schemas: CreateTableInput[] = this.loadSchemas(schemaFiles);
        let dynamoDb = new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            region: 'us-west-2',
                credentials: {
                accessKeyId: "ABC",
                secretAccessKey: "DEF"
            },
        });
        dynamoDb.endpoint = new AWS.Endpoint("http://localhost:8000");


        let listTableParams = {
//            ExclusiveStartTableName: tableName
        }

        let [listTableError, listTableResponse] = await evaluate(dynamoDb.listTables(listTableParams).promise());
        if (listTableError) {
            console.log("error: " + listTableError);
        } else {
            console.log("success: " + listTableResponse);
            let existingTables: string[] = listTableResponse["TableNames"];

            // Provision tables that don't exist
            schemas.forEach(async (s: CreateTableInput) => {
                console.log("TableName from schema = " + s.TableName);
                if (existingTables.indexOf(s.TableName) > -1) {
                    console.log(`* * * Table ${s.TableName} already exists`);
                } else {
                    console.log(`* * * Create table ${s.TableName}`);
                    let [createTableErr, createTableResponse] = await evaluate(dynamoDb.createTable(s).promise());
                    if (createTableErr) {
                        console.log(`Error creating table ${s.TableName}`);
                    } else {
                        console.log(createTableResponse);
                        provisionResult = true;
                    }
                }
            });
        }
        console.log("DB provisioning done");
        return provisionResult;
    }


}