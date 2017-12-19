// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: lb4-getting-started
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application, ApplicationConfig, CoreBindings, ProviderMap, Server} from '@loopback/core';
import {
    BindElementProvider,
    FindRouteProvider, GetFromContextProvider, InvokeMethodProvider, LogErrorProvider, ParseParamsProvider,
    RejectProvider, RestBindings,
    RestComponent, RestComponentConfig,
    RestServer, SendProvider
} from '@loopback/rest';
import {PingController} from './controllers/ping-controller';
import {HelloController} from './controllers/hello.controller';
import {SecureController} from './controllers/secure.controller';

import {AuthenticationComponent, AuthenticationBindings} from '@loopback/authentication';
import {MyAuthStrategyProvider} from './providers/auth/auth-strategy';
import {CcpRequestSequence} from './sequences/ccp-request-sequence';
import {CustomRejectProvider} from "./providers/custom-reject-provider";
import {Constructor, inject} from "@loopback/context";

import {DbProvisioner} from "./repositories/db-provisioner";
import {DynamoDbProvisioner} from "./repositories/dynamodb/dynamodb-provisioner";
import to from './util/evaluate';

import {RepositoryMixin} from '@loopback/repository';
import {UserStateController} from "./controllers/userState.controller";
import {UserStateRepositoryDynamoDao} from "./repositories/dynamodb/userState-repository-dynamo-dao";
import {UserAuthService} from "./services/user-auth-service";

import {CcpRepositoryBindings} from "./repositories/repository-bindings";
import {ServiceBindings} from "./services/service-bindings";

import AWS = require('aws-sdk');
import {LoginController} from "./controllers/login.controller";

//const DbConfig = require('cconfig')('./config/config.json');


class CustomRestComponent extends RestComponent {

    // One way evaluate override the RejectProvider. Or we can create instance of RestComponent and override there w/o
    // the CustomRestComponent class
    constructor(@inject(CoreBindings.APPLICATION_INSTANCE) app: Application,
                @inject(RestBindings.CONFIG) config?: RestComponentConfig,) {
        super(app, config);
        this.providers[RestBindings.SequenceActions.REJECT] = CustomRejectProvider
    }
}

export class StarterApplication extends Application {
  constructor(options?: ApplicationConfig) {
    if (options) {
      console.log('typeof options = ' + typeof(options));
    } else {
        console.log('options are undefined!');
    }

    let overrideOptions = Object.assign(
        {},
        {
          components: [AuthenticationComponent, CustomRestComponent],
      rest: { sequence: CcpRequestSequence }
        },
        options
    );

    super(overrideOptions);

    let testMap = Object.assign({},
        {["a"]: 1, ["b"]: 2},
        {["c"]: 3, ["b"]: 8});

    this.setupControllers();
  }

  setupControllers() {
    this.controller(PingController);
    this.controller(HelloController);
    this.controller(SecureController);
    this.controller(UserStateController);
    this.controller(LoginController);
  }

    async start() {
        const server = await this.getServer(RestServer);

        /*
console.log("env = " + DbConfig.NODE_ENV);
console.log("dbType = " + DbConfig.dbType);
*/

        // TODO: Use config evaluate separate setup for different dbs
        let dynamoDb = new AWS.DynamoDB({
            apiVersion: '2012-08-10',
            region: 'us-west-2',
            credentials: {
                accessKeyId: "ABC",
                secretAccessKey: "DEF"
            },
        });
        dynamoDb.endpoint = new AWS.Endpoint("http://localhost:8000");
        server.bind(CcpRepositoryBindings.CLIENT).to(dynamoDb);

        server.bind(CcpRepositoryBindings.USER_STATE_REPO).toClass(UserStateRepositoryDynamoDao);
        server.bind(ServiceBindings.USER_AUTH_SERVICE).toClass(UserAuthService);


        // Ugh. Don't know if it's true, but you gotta be aware of your binding dependencies. Not sure if loopback
        // can figure that out for you like SpringBoot
        server.bind(AuthenticationBindings.STRATEGY).toProvider(MyAuthStrategyProvider);

        /*
        console.log("env = " + DbConfig.NODE_ENV);
        console.log("dbType = " + DbConfig.dbType);
        */


        /*
        // TODO: need evaluate configure this provisioner via config
        let dbProvisioner: DbProvisioner = new DynamoDbProvisioner();
        let [err, result] = await evaluate(dbProvisioner.provision());
        if (err) {
            throw new Error("Unable evaluate provision DB tables");
        } else {
            console.log(`DB provisioning status = ${result}`);
        }
        */

        await super.start();
    }
}
