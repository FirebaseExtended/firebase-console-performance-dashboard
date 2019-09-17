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

import * as dl from 'datalib';

import { Connectivity } from '../types/connectivity';
import { NetworkLatencySample } from '../types/measurement-sample';
import { NetworkLatencyRecord } from '../types/measurement-record';
import { Metric } from '../types/metric';
import * as log from './test-logger';

export class TestResultsAggregator {
  testRun: number;

  constructor(testRun: number) {
    this.testRun = testRun;
  }

  calcNetworkLatencies(
    samples: NetworkLatencySample[]
  ): NetworkLatencyRecord[] {
    log.info(`Aggregating [${samples.length}] network latency samples ...`);
    const records: NetworkLatencyRecord[] = [];
    const devices: string[] = dl.unique(samples, x => x.device);
    const connectivities: Connectivity[] = dl.unique(
      samples,
      x => x.connectivity
    );
    const scripts: string[] = dl.unique(samples, x => x.script_name);
    for (const scriptName of scripts) {
      for (const device of devices) {
        for (const connectivity of connectivities) {
          const location = getLocation(samples, device);
          const browserVersion = getBrowserVersion(samples, device);
          const summary = getSummary(
            samples,
            device,
            scriptName,
            connectivity,
            location
          );
          const allResourcesFetchDurationMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.AllResourcesFetchDurationMs
            )
          );
          const documentFetchDurationMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.DocumentFetchDurationMs
            )
          );
          const firstContentfulPaintMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.FirstContentfulPaint
            )
          );
          const jsFetchDurationMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.JsFetchDurationMs
            )
          );
          const jsParseTimeMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.JsParseTimeMs
            )
          );
          const ttfbMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.TimeToFirstByte
            )
          );
          const totalReadyDurationMs = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.TotalReadyDurationMs
            )
          );
          const bytesInDocByte = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.BytesInDoc
            )
          );
          const bytesInByte = getMetricValue(
            samples,
            getPredicates(
              connectivity,
              device,
              scriptName,
              location,
              Metric.BytesIn
            )
          );
          if (
            allResourcesFetchDurationMs &&
            documentFetchDurationMs &&
            firstContentfulPaintMs &&
            jsFetchDurationMs &&
            jsParseTimeMs &&
            ttfbMs &&
            totalReadyDurationMs &&
            bytesInDocByte &&
            bytesInByte
          ) {
            const record = {
              test_run: this.testRun,
              connectivity,
              device,
              script_name: scriptName,
              location,
              browser_version: browserVersion,
              summary,
              all_resources_fetch_duration_ms: allResourcesFetchDurationMs,
              document_fetch_duration_ms: documentFetchDurationMs,
              first_contentful_paint_ms: firstContentfulPaintMs,
              js_fetch_duration_ms: jsFetchDurationMs,
              js_parse_time_ms: jsParseTimeMs,
              ttfb_ms: ttfbMs,
              total_ready_duration_ms: totalReadyDurationMs,
              bytes_in_doc_byte: bytesInDocByte,
              bytes_in_byte: bytesInByte,
            };
            records.push(record);
          }
        }
      }
    }
    log.info('Network latency aggregation done.');
    return records;
  }
}

function getPredicates<T extends NetworkLatencySample>(
  connectivity: string,
  device: string,
  scriptName: string,
  location: string,
  metric: Metric
): Array<(x: T) => boolean> {
  return [
    x => x.connectivity === connectivity,
    x => x.device === device,
    x => x.script_name === scriptName,
    x => x.location === location,
    x => x.metric_name === metric,
    x => x.metric_value !== null && x.metric_value > 0,
  ];
}

function getMetricValue<T extends NetworkLatencySample>(
  samples: T[],
  predicates: Array<(x: T) => boolean>
): number {
  const predicate = (x: T) => predicates.reduce((r, p) => r && p(x), true);
  const records = samples.filter(predicate);
  return dl.mean(records, (x: T) => x.metric_value);
}

function getBrowserVersion(
  samples: NetworkLatencySample[],
  device: string
): string {
  const records = samples.filter(x => x.device === device);
  return records[0].browser_version;
}

function getLocation(samples: NetworkLatencySample[], device: string): string {
  const records = samples.filter(x => x.device === device);
  return records[0].location;
}

function getSummary<T extends NetworkLatencySample>(
  samples: T[],
  device: string,
  scriptName: string,
  connectivity: string,
  location: string
): string {
  const predicates = [
    x => x.device === device,
    x => x.script_name === scriptName,
    x => x.connectivity === connectivity,
    x => x.location === location,
  ];
  const predicate = (x: T) => predicates.reduce((r, p) => r && p(x), true);
  const records = samples.filter(predicate);
  if (records !== null && records.length > 0) {
    return records[0].summary;
  } else {
    return '';
  }
}
