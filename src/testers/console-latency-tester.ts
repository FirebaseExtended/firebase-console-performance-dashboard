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

import { apiKey, server } from '../settings/web-page-test';
import { allScripts } from '../settings/wpt-scripts';
import { Connectivity } from '../types/connectivity';
import { Device } from '../types/device';
import { NetworkLatencySample } from '../types/measurement-sample';
import { Metric } from '../types/metric';
import { Script } from '../types/script';
import * as log from '../utils/test-logger';
import { WebPageTestClient } from '../utils/web-page-test-client';

const client = new WebPageTestClient(server, apiKey, 60000);

export async function run(
  devices: Device[],
  connectivities: Connectivity[]
): Promise<NetworkLatencySample[]> {
  log.info('Start to measure startup latencies ...');
  const networkLatencyScripts = allScripts;
  const [networkLatencySamples] = await Promise.all([
    testNetworkLatencyPages(networkLatencyScripts, devices, connectivities),
  ]);
  log.info('Startup latency measurements finished.');
  return networkLatencySamples;
}

async function testNetworkLatencyPages(
  scripts: Script[],
  devices: Device[],
  connectivities: Connectivity[]
): Promise<NetworkLatencySample[]> {
  const promises: Array<Promise<NetworkLatencySample[]>> = [];
  for (const script of scripts) {
    for (const device of devices) {
      for (const connectivity of connectivities) {
        promises.push(testNetworkLatencyPage(script, device, connectivity));
      }
    }
  }
  const samples = await Promise.all(promises);
  return [].concat(...samples);
}

async function testNetworkLatencyPage(
  script: Script,
  device: Device,
  connectivity: Connectivity
): Promise<NetworkLatencySample[]> {
  try {
    const result = await client.submitTest(script, device, connectivity);
    return parseNetworkLatencyResult(script.name, device, connectivity, result);
  } catch (error) {
    log.warn(
      `Network latency test for [${script.name}] on [${device.id}] with ` +
        `[${connectivity}] errored: [${JSON.stringify(error)}]. Test skipped.`
    );
    return [];
  }
}

export async function parseNetworkLatencyResult(
  scriptName: string,
  device: Device,
  connectivity: Connectivity,
  // tslint:disable-next-line:no-any
  result: any
): Promise<NetworkLatencySample[]> {
  const samples: NetworkLatencySample[] = [];
  for (const run of Object.keys(result.data.runs)) {
    try {
      const firstView = result.data.runs[run].firstView;
      const summary = result.data.summary;
      // Discard the run if allResourcesFetchDurationMs is null.
      if (firstView.allResourcesFetchDurationMs === null) {
        log.info(
          `Skipping [${run}-th] run data for [${scriptName}] on ` +
            `[${device.id}] with [${connectivity}] since ` +
            `allResourcesFetchDurationMs is null.`
        );
        continue;
      }
      const browserVersion = firstView.browserVersion;
      const base = {
        run_id: run,
        device: device.id,
        location: device.location,
        script_name: scriptName,
        browser_version: browserVersion,
        summary,
        connectivity,
      };
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.AllResourcesFetchDurationMs,
          metric_value: firstView.allResourcesFetchDurationMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.DocumentFetchDurationMs,
          metric_value: firstView.documentFetchDurationMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.FirstContentfulPaint,
          metric_value: firstView.firstContentfulPaintDurationMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.JsFetchDurationMs,
          metric_value: firstView.jsFetchDurationMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.JsParseTimeMs,
          metric_value: firstView.jsParseTimeMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.TimeToFirstByte,
          metric_value: firstView.timeToFirstByteMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.TotalReadyDurationMs,
          metric_value: firstView.totalReadyDurationMs,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.BytesInDoc,
          metric_value: firstView.bytesInDoc,
        })
      );
      samples.push(
        Object.assign({}, base, {
          metric_name: Metric.BytesIn,
          metric_value: firstView.bytesIn,
        })
      );
    } catch (error) {
      log.warn(
        `Failed to extract [${run}-th] run data for [${scriptName}] on ` +
          `[${device.id}] with [${connectivity}]: [${error}]. Skipping the run.`
      );
    }
  }
  return samples;
}
