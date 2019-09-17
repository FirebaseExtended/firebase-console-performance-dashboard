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

import { Script } from '../types/script';

const user = process.env.WPT_USER;

const pwd = process.env.WPT_PASSWORD;

const loginScript = `
combineSteps  7
logData    0
navigate  https://accounts.google.com
execAndWait  document.querySelector('.cta-signin').click();
execAndWait  document.querySelector('#identifierId').value='${user}';
execAndWait  document.querySelector('#identifierNext').click();
execAndWait  document.querySelector('[name=password]').value='${pwd}';
execAndWait  document.querySelector('#passwordNext').click();
sleep	3
combineSteps  1
logData    1
`;
const waitForLoaded = `
  sleep 3`;

const scriptTemplate = `
combineSteps  7
logData    0
navigate  https://accounts.google.com
execAndWait  document.querySelector('.cta-signin').click();
execAndWait  document.querySelector('#identifierId').value='${user}';
execAndWait  document.querySelector('#identifierNext').click();
execAndWait  document.querySelector('[name=password]').value='${pwd}';
execAndWait  document.querySelector('#passwordNext').click();
sleep	3
combineSteps  1
logData    1
navigate [URL]
sleep 5
`;

const legacyHome = scriptTemplate.replace(
  '[URL]',
  'https://console.firebase.google.com/'
);

const nghome = scriptTemplate.replace(
  '[URL]',
  'https://console.firebase.google.com/ngh/'
);

const overview = scriptTemplate.replace(
  '[URL]',
  'https://console.firebase.google.com/project/fir-demo-project/overview'
);

const nghOverview = scriptTemplate.replace(
  '[URL]',
  'https://console.firebase.google.com/ngh/project/fir-demo-project/overview'
);

export const allScripts: Script[] = [
  {
    name: 'legacy_home',
    script: legacyHome,
  },
  {
    name: 'nghome',
    script: nghome,
  },
  {
    name: 'overview',
    script: overview,
  },
  {
    name: 'nhg_overview',
    script: nghOverview,
  },
];
