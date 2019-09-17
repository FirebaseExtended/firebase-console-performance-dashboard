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

export const server = 'www.webpagetest.org';

export const apiKey = process.env.WPT_API_KEY;

const collectMetric = `
[allResourcesFetchDurationMs]
return window['_fbc_performance_metrics'].allResourcesFetchDurationMs;
[documentFetchDurationMs]
return window['_fbc_performance_metrics'].documentFetchDurationMs;
[firstContentfulPaintDurationMs]
return window['_fbc_performance_metrics'].firstContentfulPaintDurationMs;
[jsFetchDurationMs]
return window['_fbc_performance_metrics'].jsFetchDurationMs;
[jsParseTimeMs]
return window['_fbc_performance_metrics'].jsParseTimeMs;
[timeToFirstByteMs]
return window['_fbc_performance_metrics'].timeToFirstByteMs;
[totalReadyDurationMs]
return window['_fbc_performance_metrics'].totalReadyDurationMs;
`;

export const options = {
  firstViewOnly: true,
  breakDown: true,
  timeline: true,
  chromeTrace: true,
  video: true,
  fullResolutionScreenshot: false,
  emulateMobile: false,
  runs: 6,
  pollResults: 10,
  timeout: 2700,
  custom: collectMetric,
};
