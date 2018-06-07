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
import babel from 'rollup-plugin-babel';
//import { uglify } from 'rollup-plugin-uglify';
import path from 'path';
import appPkg from './app/package.json';
import authPkg from './auth/package.json';
import capturePkg from './capture/package.json';
import managePkg from './manage/package.json';
import pkg from './package.json';

const pkgsByName = {
  app: appPkg,
  auth: authPkg,
  capture: capturePkg,
  manage: managePkg
};

const plugins = [
  babel({
    exclude: 'node_modules/**'
  }),
  resolve(),
  commonjs()
];

const external = Object.keys(pkg.dependencies || {});

/**
 * Global UMD Build
 */
const GLOBAL_NAME = 'capturoo';

/**
 * Individual Component Builds
 */
const appBuilds = [
  /**
   * App Browser Builds
   */
  //{
  //  input: 'app/index.js',
  //  output: [
  //    { file: path.resolve('app', appPkg.main), format: 'cjs' },
  //    { file: path.resolve('app', appPkg.module), format: 'es' }
  //  ],
  //  plugins
  //},
  /**
   * App UMD Builds
   */
  //{
  //  input: 'app/index.js',
  //  output: {
  //    dir: 'dist',
  //    file: 'capturoo-app.js',
  //    sourcemap: true,
  //    format: 'umd',
  //    name: GLOBAL_NAME
  //  },
  //  plugins: [...plugins, uglify()]
  //}
];

const components = [
  'auth',
  'capture',
  'manage'
];
const componentBuilds = components
  .map(component => {
    const pkg = pkgsByName[component];
    return [
      //{
      //  input: `${component}/index.js`,
      //  output: [
      //    { dir: 'dist', file: path.resolve(component, pkg.main), format: 'cjs' },
      //    { dir: 'dist', file: path.resolve(component, pkg.module), format: 'es' }
      //  ],
      //  plugins
      //},
      {
        input: `${component}/index.js`,
        output: {
          dir: 'dist',
          file: `capturoo-${component}.js`,
          format: 'iife',
          sourcemap: true,
          extend: true,
          name: GLOBAL_NAME,
          globals: {
            '@capturoo/app': GLOBAL_NAME
          },
          intro: `try  {`,
          outro: `} catch(err) {
              console.error(err);
              throw new Error(
                'Cannot instantiate capturoo-${component} - ' +
                'be sure to load capturoo-app.js first.'
              );
            }`
        },
        //plugins: [...plugins, uglify()]
        plugins: [...plugins],
        external: ['@capturoo/app']
      }
    ];
  })
  .reduce((a, b) => a.concat(b), []);

/**
 * Complete Package Builds
 */
const completeBuilds = [
  /**
   * App Browser Builds
   */
  //{
  //  input: 'src/index.js',
  //  output: [
  //    { dir: 'dist', file: pkg.browser, format: 'cjs' },
  //    { dir: 'dist', file: pkg.module, format: 'es' }
  //  ],
  //  plugins
  //},
  //{
  //  input: 'src/index.cdn.js',
  //  output: {
  //    dir: 'dist',
  //    file: 'dist/capturoo.js',
  //    format: 'umd',
  //    name: GLOBAL_NAME
  //  },
  //  plugins: [...plugins, uglify()]
  //},
  /**
   * App Node.js Builds
   */
  //{
  //  dir: 'dist',
  //  input: 'src/index.node.js',
  //  output: { file: pkg.main, format: 'cjs' },
  //  plugins
  //}
];

export default [...appBuilds, ...componentBuilds, ...completeBuilds];
