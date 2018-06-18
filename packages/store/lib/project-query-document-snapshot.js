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

/**
 * A ProjectQueryDocumentSnapshot contains data read from a document in your
 * projects as part of a query. The document is guaranteed to exist and
 * its data can be extracted with .data().
 *
 * A ProjectQueryDocumentSnapshot offers the same API surface as a
 * ProjectDocumentSnapshot. Since query results contain only existing
 * documents, the exists property will always be true and data() will never
 * return undefined.
 */
const ProjectDocumentSnapshot = require('./project-document-snapshot');

class ProjectQueryDocumentSnapshot extends ProjectDocumentSnapshot {
  /**
   * @typedef {object} ProjectData
   * @property {string} ProjectData.pid
   * @property {string} ProjectData.name
   * @property {string} ProjectData.publicApiKey
   * @property {number} ProjectData.leadsCount
   * @property {string} ProjectData.created ISO string
   * @property {string} ProjectData.lastModified ISO string
   * @param {string} pid project IDS
   * @param {capturoo.store.ProjectDocumentReference} ref non-null
   *   The ProjectDocumentReference for the document included in the
   *   ProjectDocumentSnapshot.
   * @param {ProjectData} projectData
   */
  constructor(pid, ref, projectData) {
    super(pid, ref, projectData);
  }

  data() {
    return super.data();
  }
}

module.exports = ProjectQueryDocumentSnapshot;
