(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global.capturoo = factory());
}(this, (function () { 'use strict';

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  var capturooApp = createCommonjsModule(function (module) {
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
        capturoo: namespace,
        services: {}
      });
    }
  }

  function createCapturooNamespace() {
    let apps = {};
    let factories = {};
    let namespace = {
      // Hack to prevent Babel from modifying the object returned
      // as the firebase namespace.
      __esModule: true,
      apps,
      factories: factories,
      initApp,
      registerService
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
  }

  module.exports = {
    CapturooApp,
    createCapturooNamespace
  };
  });

  var capturooApp$1 = unwrapExports(capturooApp);
  var capturooApp_1 = capturooApp.CapturooApp;
  var capturooApp_2 = capturooApp.createCapturooNamespace;

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
  const { createCapturooNamespace } = capturooApp;

  const capturoo = createCapturooNamespace();

  var app = capturoo;

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

  return app;

})));
//# sourceMappingURL=capturoo-app.js.map
