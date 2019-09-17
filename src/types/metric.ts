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

export const enum Metric {
  AllResourcesFetchDurationMs = 'all_resources_fetch_duration_ms',
  DocumentFetchDurationMs = 'document_fetch_duration_ms',
  FirstContentfulPaint = 'first_contentful_paint_ms',
  JsFetchDurationMs = 'js_fetch_duration_ms',
  JsParseTimeMs = 'js_parse_time_ms',
  TimeToFirstByte = 'ttfb_ms',
  TotalReadyDurationMs = 'total_ready_duration_ms',
  BytesInDoc = 'bytes_in_doc_byte',
  BytesIn = 'bytes_in_byte',
}

export const metrics = [
  Metric.AllResourcesFetchDurationMs,
  Metric.DocumentFetchDurationMs,
  Metric.FirstContentfulPaint,
  Metric.JsFetchDurationMs,
  Metric.JsParseTimeMs,
  Metric.TimeToFirstByte,
  Metric.TotalReadyDurationMs,
  Metric.BytesInDoc,
  Metric.BytesIn,
];

export function deserialize(name: string): Metric {
  for (const metric of metrics) {
    if (metric === name) {
      return metric;
    }
  }
  return null;
}
