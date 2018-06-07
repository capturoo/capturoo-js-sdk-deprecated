/**
 * Copyright 2018 Capturoo
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
import resolve from 'rollup-plugin-node-resolve';
import builtins from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import pkg from './package.json';

const plugins = [
  resolve(),
  builtins(),
  commonjs()
];

export default [
  /**
   * Browser Builds
   */
  {
    input: 'index.js',
    output: [
      { file: pkg.browser, format: 'cjs' },
      { file: pkg.module, format: 'es' }
    ],
    plugins
  },
  /**
   * Node.js Build
   */
  {
    input: 'index.js',
    output: [{ file: pkg.main, format: 'cjs' }],
    plugins: [
      ...plugins
    ]
  }
];
