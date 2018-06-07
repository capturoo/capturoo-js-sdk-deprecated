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

class CapturooApp {
  constructor(namespace) {
    Object.assign(this, {
      capturoo: namespace,
      services: {}
    });
  }
}

function createCapturooNamespace() {
  let factories = {};
  let namespace = {
    // Hack to prevent Babel from modifying the object returned
    // as the firebase namespace.
    __esModule: true,
    apps: {},
    factories: factories,
    initApp: initApp
  };

  function initApp() {
    let app = new CapturooApp(namespace);
    apps.default= app;

    return app;
  }

  function registerService(name, serviceFactory) {
    if (factories[name]) {
      let e = new Error('Duplicate service "${name}"');
      e.code = 'duplicate-service';
      throw e;
    }

    factories[name] = serviceFactory;
  }
  return namespace;
};

export {
  CapturooApp,
  createCapturooNamespace
}
