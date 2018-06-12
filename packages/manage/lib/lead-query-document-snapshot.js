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
 * A LeadQueryDocumentSnapshot contains data read from a document in your
 * leads store as part of a query. The document is guaranteed to exist and
 * its data can be extracted with .data().
 *
 * A LeadQueryDocumentSnapshot offers the same API surface as a
 * LeadDocumentSnapshot. Since query results contain only existing
 * documents, the exists property will always be true and data() will never
 * return undefined.
 */
class LeadQueryDocumentSnapshot {
  /**
   * @param {LeadDocumentReference} ref The DocumentReference for the
   *   document included in the DocumentSnapshot.
   * @param {bool} exists
   */
  constructor(lid, ref, data = {}) {
    Object.assign(this, {
      lid,
      ref,
      exists: true,
      data
    });
  }

  /**
   * Retrieves all fields in the lead as an Object
   */
  data() {
    return this.lead;
  }
}

module.exports = LeadQueryDocumentSnapshot;
