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
 * A QuerySnapshot contains zero or more QueryDocumentSnapshot objects
 * representing the results of a query. The documents can be accessed as an
 * array via the docs property or enumerated using the forEach method. The
 * number of documents can be determined via the empty and size properties.
 */
class QuerySnapshot {
  /**
   *
   * @param {docs} docs  An array of all the documents in the QuerySnapshot
   * @param {capturoo.storeQuery} The query you called get on to get the
   *   QuerySnapshot.
   */
  constructor(docs = [], query) {
    Object.assign(this, {
      size: docs.length,
      _docs: docs,
      query
    });
  }

  /**
   *
   */
  static _add() {
    this._docs.push();
    this.size++;
  }

  /**
   * An array of all the documents in the QuerySnapshot
   * @returns {capturoo.store.LeadsQueryDocumentSnapshot} non-null Array
   *   of non-null
   */
  docs() {
    return this._docs;
  }

  /**
   * @returns {bool} True if there are no documents in the QuerySnapshot.
   */
  empty() {
    return (this.size === 0) ? true : false;
  }

  /**
   * Enumerates all of the documents in the QuerySnapshot.
   * @param {function} callback
   */
  forEach(callback) {
    if (typeof callback !== 'function') {
      throw TypeError('callback must be a function');
    }

    for (const doc of this._docs) {
      callback(doc);
    }
  }

  [Symbol.iterator]() {
    var index = -1;
    var docs  = this._docs;

    return {
      next: () => ({
        value: docs[++index],
        done: !(index in docs)
      })
    };
  };
}

module.exports = QuerySnapshot;
