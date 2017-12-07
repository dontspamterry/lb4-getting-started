// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: lb4-getting-started
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {Application, ApplicationConfig} from '@loopback/core';
import {RestComponent, RestServer} from '@loopback/rest';
import {PingController} from './controllers/ping-controller';
import {HelloController} from './controllers/hello.controller';
import {SecureController} from './controllers/secure.controller';

import {AuthenticationComponent, AuthenticationBindings} from '@loopback/authentication';
import {MyAuthStrategyProvider} from './providers/auth-strategy';
import {MySequence} from './sequences/request-sequence';

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
          components: [AuthenticationComponent, RestComponent],
            rest: { sequence: MySequence }
        },
        options
    );

    super(overrideOptions);
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
