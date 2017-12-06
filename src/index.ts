// Copyright IBM Corp. 2017. All Rights Reserved.
// Node module: lb4-getting-started
// This file is licensed under the MIT License.
// License text available at https://opensource.org/licenses/MIT

import {StarterApplication} from './application';
import {RestServer} from '@loopback/rest';
import {ApplicationConfig} from '@loopback/core';

export {StarterApplication};

export async function main(options?: ApplicationConfig) {
  const app = new StarterApplication(options);

  try {
    await app.start();
    const server = await app.getServer(RestServer);
    const port = await server.get('rest.port');
    console.log(`Server is running at http://127.0.0.1:${port}`);
    console.log(`Try http://127.0.0.1:${port}/ping`);
  } catch (err) {
    console.error(`Unable to start application: ${err}`);
  }
  return app;
}
