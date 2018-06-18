const chai = require('chai');
const assert = chai.assert;

const capturoo = require('../../app/index');
require('../../auth/index');
require('../index');
const config = require('../config');

const TIMEOUT_MS = 20 * 1000;
const SUPER_LONG_TIMEOUT_MS = 120 * 1000;

let auth;
let store;

let user;
let accountDocRef;
let project1DocRef;
let project2DocRef;

describe('Store SDK', async () => {
  before(async () => {
    try {
      capturoo.initApp(config);
      auth = capturoo.auth(config);
      store = capturoo.store(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should check the store.VERSION', function(done) {
    this.timeout(TIMEOUT_MS);
    if (store.VERSION !== process.env.VERSION) {
      done(`Expected version '${process.env.VERSION}', got '${store.VERSION}'`);
    }
    done();
  });

  it('should signup andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let user = await auth.signUpUser(
        'andyfusniak+000@gmail.com', 'testtest', 'A User');
      assert.isObject(user, 'user should be an object type');
      assert.containsAllKeys(user, ['uid', 'email', 'displayName', 'created']);
      assert.strictEqual(user.email, 'andyfusniak+000@gmail.com');
      assert.strictEqual(user.displayName, 'A User');
    } catch (err) {
      throw err;
    }
  });

  it('should log in as user A', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let userCredential = await auth.signInWithEmailAndPassword(
        'andyfusniak+000@gmail.com', 'testtest');
      user = userCredential.user;
      store.setToken(capturoo.auth().getToken());
      assert.isObject(user, 'user should be an object type');
      assert.strictEqual(user.emailVerified, false);
    } catch (err) {
      throw err;
    }
  });

  it('should wait for GCF to generate new account', function(done) {
    this.timeout(SUPER_LONG_TIMEOUT_MS);
    function keepChecking() {
      setTimeout(function() {
        store.accounts().doc(user.uid).get()
          .then(docSnap => {
            if (docSnap.exists) {
              account = docSnap.ref;
              return done();
            }
            keepChecking();
          })
          .catch(err => {
            console.error(err);
          })
      }, 5000);
    }

    keepChecking();
  });

  //it('should update account andyfusniak+000@gmail.com', async function() {
  //  this.timeout(TIMEOUT_MS);
  //  try {
  //    account.name = 'Acme Inc';
  //    account.update();
  //    assert.strictEqual(account.aid, user.uid);
  //    assert.strictEqual(account.name, 'Acme Inc');
  //  } catch (err) {
  //    throw err;
  //  }
  //});

  it('should retrieve account andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let accountSnapshot = await store.accounts().doc(user.uid).get();
      if (!accountSnapshot.exists) {
        throw Error(`Failed store.accounts().doc(${user.uid}).get()`);
      }

      accountDocRef = accountSnapshot.ref;
      assert.hasAllKeys(accountSnapshot.data(), [
        'aid',
        'email',
        'privateApiKey',
        'created',
        'lastModified'
      ]);
      assert.strictEqual(accountSnapshot.data().aid, user.uid);
      assert.strictEqual(accountSnapshot.data().email, 'andyfusniak+000@gmail.com');
    } catch (err) {
      throw err;
    }
  });


  it('should create two new projects for account one', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      project1DocRef = await accountDocRef.projects().add({
        pid: 'apple-12345',
        projectName: 'Apple project'
      });
      project2DocRef = await accountDocRef.projects().add({
        pid: 'banana-45678',
        projectName: 'Banana project'
      });
      let project1Snapshot = await project1DocRef.get();
      let project2Snapshot = await project1DocRef.get();

      assert.strictEqual(project1Snapshot.exists, true);
      assert.strictEqual(project2Snapshot.exists, true);
    } catch (err) {
      throw err;
    }
  });

  it('should fail to create a project (aleady exists)', function(done) {
    this.timeout(TIMEOUT_MS);
    accountDocRef.projects().add({
      pid: 'apple-12345',
      projectName: 'Apple project'
    })
      .then(project => {
        done(project);
      })
      .catch(err => {
        if (err.code === 409) {
          return done();
        }
        done(err);
      });
  });

  it('should fail to retrieve a non-existent project', function(done) {
    this.timeout(TIMEOUT_MS);
    accountDocRef.projects().doc('missing').get()
      .then(projectDocSnap => {
        if (projectDocSnap.exists) {
          done(project);
        } else {
          done();
        }
      })
      .catch(err => {
        done(err);
      });
  });

  // it('should check that non-existent project is available', async function() {
  //   this.timeout(TIMEOUT_MS);
  //   try {
  //     let exists = await account.isProjectIdAvailable(
  //       'i-dont-exist', 'project id should be available');
  //     assert.strictEqual(exists, true);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should check that an existing project is not available', async function() {
  //   this.timeout(TIMEOUT_MS);
  //   try {
  //     let exists = await account.isProjectIdAvailable(
  //       'apple-12345', 'project id should not be available');
  //     assert.strictEqual(exists, false);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  it('should retrieve project one by pid', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let projectDocRef = account.projects().doc(project1DocRef.pid);
      let projectDocSnap = await projectDocRef.get();

      assert.strictEqual(projectDocSnap.exists, true);
      let data = projectDocSnap.data();
      assert.containsAllKeys(data, [
        'leadsCount',
        'pid',
        'projectName',
        'publicApiKey',
        'created',
        'lastModified'
      ]);
    } catch (err) {
      throw err;
    }
  });

  it('should retrieve all projects associated with account one', async function() {
    this.timeout(TIMEOUT_MS);

    try {
      let projectsQuerySnapshot = await account.projects().get();

      let projects = projectsQuerySnapshot.docs();
      assert.isArray(projects);
      assert.isNotEmpty(projects);
      assert.lengthOf(projects, 2, 'array has length of 2');

      assert.typeOf(projects[0], 'object', 'we have an object');
      assert.typeOf(projects[1], 'object', 'we have an object');

      assert.strictEqual(projects[0].pid, project1DocRef.pid);
      //assert.strictEqual(projects[0].projectName, 'Banana project');

      assert.strictEqual(projects[1].pid, project2DocRef.pid);
      //assert.strictEqual(projects[1].projectName, 'Apple project');
    } catch (err) {
      throw err;
    }
  });

  it('should delete user andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      await user.delete();
    } catch (err) {
      throw err;
    }
  });
});
