/**
 * @license
 * Copyright 2019 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { argv } from 'yargs';

import * as sql from './settings/cloud-sql';
import * as connectivity from './settings/connectivities';
import * as device from './settings/devices';
import * as latencyTester from './testers/console-latency-tester';
import { CloudSqlClient } from './utils/cloud-sql-client';
import * as log from './utils/test-logger';
import { TestResultsAggregator } from './utils/test-results-aggregator';

async function run(testRun: number): Promise<void> {
  const trial = !!argv['trial'];
  const connectivities = trial ? connectivity.trial : connectivity.official;
  const database = trial ? sql.trial : sql.official;
  const devices = trial ? device.trial : device.official;

  log.info('Startup Latency Test started ...');
  log.info(`TestRun [${testRun}], trial? [${trial}].`);

  const networkLatencySamples = await latencyTester.run(
    devices,
    connectivities
  );

  const aggregator = new TestResultsAggregator(testRun);
  const netLatencies = aggregator.calcNetworkLatencies(networkLatencySamples);

  if (trial) {
    //log.info('Network latency raw samples:', networkLatencySamples);
    //log.info('Network latency aggregated records:', netLatencies);
  }

  const client = await new CloudSqlClient(database).initialize();
  await client.uploadMeasurements(netLatencies);
  await client.terminate();

  log.info('Startup Latency Test finished.');
}

async function launch(): Promise<void> {
  const now = Date.now();
  const testRun = Math.round(now / 1000);
  try {
    await run(testRun);
  } catch (error) {
    log.error(`Test failed: ${error}.`);
    process.exitCode = 1;
  } finally {
    log.info(`Test finished in ${(Date.now() - now) / 1000}s.`);
    // Unclosed web sockets created by firebase tools stop node from exiting.
    // See https://github.com/firebase/firebase-tools/issues/118.
    process.exit();
  }
}

launch().catch(error => {
  log.error(error);
});
