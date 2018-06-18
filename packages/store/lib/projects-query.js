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
const Query = require('./query');
const fetch = require('node-fetch');
const ProjectQueryDocumentSnapshot = require('./project-query-document-snapshot');
const ProjectDocumentReference = require('./project-document-reference');
const QuerySnapshot = require('./query-snapshot');

class ProjectsQuery extends Query {
  constructor(store, parent) {
    super(store, parent);
  }

  async get() {
    let headers = {
      'Content-Type': 'application/json'
    };
    Object.assign(headers, this.store.getAuthHeader());

    try {
      let res = await fetch(`${this.store.config.capture.endpoint}/projects`, {
        headers,
        mode: 'cors'
      });

      let projects = [];
      for (const data of await res.json()) {
        let pid = data.pid;
        projects.push(new ProjectQueryDocumentSnapshot(
          pid,
          new ProjectDocumentReference(this.store, pid, this.parent),
          data
        ));
      };
      return new QuerySnapshot(projects, this);
    } catch (err) {
      throw err;
    }
  }
}

module.exports = ProjectsQuery;
