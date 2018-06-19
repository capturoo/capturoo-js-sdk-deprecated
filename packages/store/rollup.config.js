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
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import builtins from 'rollup-plugin-node-builtins';
import babel from 'rollup-plugin-babel';
import pkg from './package.json';

const plugins = [
  resolve(),
  commonjs(),
  json(),
  builtins(),
  babel({
    exclude: 'node_modules/**' // only transpile our source code
  })
];

const external = Object.keys(
  Object.assign({}, pkg.peerDependencies, pkg.dependencies)
);

export default [
  /**
   * browser builds
   */
  {
    input: 'index.js',
    treeshake: false,
    output: [
      { file: pkg.browser, format: 'cjs', sourcemap: false },
      { file: pkg.module, format: 'es', sourcemap: false }
    ],
    plugins,
    external
  },

  /**
   * Node.js build
   */
  {
    input: 'index.js',
    treeshake: false,
    output: [
      { file: pkg.main, format: 'cjs', sourcemap: false }
    ],
    plugins,
    external
  }
];
