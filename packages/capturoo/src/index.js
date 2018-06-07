/**
 * Copyright 2017 Capturoo
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

console.warn(`
It looks like you're using the development build of the Capturoo JS SDK.
When deploying Capturoo apps to production, it is advisable to only import
the individual SDK components you intend to use.

For the module builds, these are available in the following manner
(replace <PACKAGE> with the name of a component - i.e. auth, capture, manage):

CommonJS Modules:
const capturoo = require('capturoo/app');
require('capturoo/<PACKAGE>');

ES Modules:
import capturoo from 'capturoo/app';
import 'capturoo/<PACKAGE>';
`);

import capturoo from '../app';
import '../auth';
import '../capture';
import '../manage';

export default capturoo;
