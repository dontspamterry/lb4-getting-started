// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: lb4-getting-started
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application, ApplicationConfig, ProviderMap, Server} from '@loopback/core';
import {
    BindElementProvider,
    FindRouteProvider, GetFromContextProvider, InvokeMethodProvider, LogErrorProvider, ParseParamsProvider,
    RejectProvider, RestBindings,
    RestComponent,
    RestServer, SendProvider
} from '@loopback/rest';
import {PingController} from './controllers/ping-controller';
import {HelloController} from './controllers/hello.controller';
import {SecureController} from './controllers/secure.controller';

import {AuthenticationComponent, AuthenticationBindings} from '@loopback/authentication';
import {MyAuthStrategyProvider} from './providers/auth-strategy';
import {MySequence} from './sequences/request-sequence';
import {CustomRejectProvider} from "./providers/custom-reject-provider";
import {Constructor} from "@loopback/context";


class CustomRestComponent extends RestComponent {
  controllers = [PingController, HelloController, SecureController];
  providers = {
      [RestBindings.SequenceActions.LOG_ERROR]: LogErrorProvider,
      [RestBindings.SequenceActions.FIND_ROUTE]: FindRouteProvider,
      [RestBindings.SequenceActions.INVOKE_METHOD]: InvokeMethodProvider,
      [RestBindings.SequenceActions.REJECT]: CustomRejectProvider,
      [RestBindings.BIND_ELEMENT]: BindElementProvider,
      [RestBindings.GET_FROM_CONTEXT]: GetFromContextProvider,
      [RestBindings.SequenceActions.PARSE_PARAMS]: ParseParamsProvider,
      [RestBindings.SequenceActions.SEND]: SendProvider,
  };
  /* Not sure why, but this doesn't work  :(  Keeping it here for now, so maybe it's misunderstanding in usage on my
     part
  providers: ProviderMap = Object.assign(
      {},
      super.providers,
      {
          [RestBindings.SequenceActions.REJECT]: CustomRejectProvider,
      }
  );
  */
    servers: {
        [name: string]: Constructor<Server>;
    } = {
        RestServer,
    };
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
      rest: { sequence: MySequence }
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
  }

  async start() {
    const server = await this.getServer(RestServer);
    server.bind(AuthenticationBindings.STRATEGY).toProvider(MyAuthStrategyProvider);
    await super.start();
  }
}
