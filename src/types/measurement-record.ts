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

import { Connectivity } from './connectivity';

export interface NetworkLatencyRecord {
  test_run: number;
  location: string;
  connectivity: Connectivity;
  device: string;
  script_name: string;
  browser_version: string;
  summary: string;
  all_resources_fetch_duration_ms: number;
  document_fetch_duration_ms: number;
  first_contentful_paint_ms: number;
  js_fetch_duration_ms: number;
  js_parse_time_ms: number;
  ttfb_ms: number;
  total_ready_duration_ms: number;
  bytes_in_doc_byte: number;
  bytes_in_byte: number;
}
