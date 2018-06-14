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
class ProjectQueryDocumentSnapshot {
  /**
   * @typedef {object} ProjectData
   * @property {string} ProjectData.pid
   * @property {string} ProjectData.name
   * @property {string} ProjectData.publicApiKey
   * @property {number} ProjectData.leadsCount
   * @property {string} ProjectData.created ISO string
   * @property {string} ProjectData.lastModified ISO string
   * @param {LeadDocumentReference} ref The DocumentReference for the
   *   document included in the DocumentSnapshot.
   * @param {bool} exists
   * @param {capturoo.store.ProjectDocumentReference} ref non-null
   *   The ProjectDocumentReference for the document included in the
   *   ProjectDocumentSnapshot.
   * @param {bool} exists
   * @param {ProjectData} projectData
   */
  constructor(pid, ref, projectData) {
    Object.assign(this, {
      pid,
      ref,
      exists: true
    });

    this.project = {
      pid: projectData.pid,
      projectName: projectData.projectName,
      publicApiKey: projectData.publicApiKey,
      leadsCount: projectData.leadsCount,
      created: new Date(projectData.created),
      lastModified: new Date(projectData.lastModified)
    }
  }

  /**
   * Retrieves all fields in the document as an Object. Returns undefined
   * if the document doesn't exist.
   * @returns {ProjectData}
   */
  data() {
    return this.project;
  }
}

module.exports = ProjectQueryDocumentSnapshot;
