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

class CapturooApp {
  constructor(namespace) {
    Object.assign(this, {
      namespace,
      services: {}
    });
  }

  getService(name) {
    if (!this.services[name]) {
      const service = this.namespace.factories[name](this.namespace.config);
      this.services[name] = service;
    }

    return this.services[name];
  }
}

function createCapturooNamespace() {
  let factories = {};
  let namespace = {
    // Hack to prevent Babel from modifying the object returned
    // as the firebase namespace.
    __esModule: true,
    app: undefined,
    factories: factories,
    initApp: initApp,
    registerService
  };

  function initApp(config = {}) {
    Object.assign(namespace, {
      config: Object.assign(config),
      app: new CapturooApp(namespace)
    });
    return namespace.app;
  }

  function registerService(name, serviceFactory) {
    if (factories[name]) {
      let e = new Error(`Duplicate service "${name}"`);
      e.code = 'duplicate-service';
      throw e;
    }

    factories[name] = serviceFactory;

    CapturooApp.prototype[name] = function(...args) {
      const serviceFxn = this.getService.bind(this, name);
      return serviceFxn.apply(this, args);
    }

    Object.defineProperty(namespace, name, {
      get: function() {
        if (namespace.app) {
          return function(...args) {
            const service = namespace.app.getService(name);
            return service;
          };
        }
        return undefined;
      }
    });

  }
  return namespace;
};

module.exports = {
  CapturooApp,
  createCapturooNamespace
};
