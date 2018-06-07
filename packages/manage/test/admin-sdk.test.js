const chai = require('chai');
const assert = chai.assert;
const DashboardSDK = require('../lib/DashboardSDK');
const config = require('../config');
const Project = require('../lib/Project');

const TIMEOUT_MS = 20 * 1000;
const SUPER_LONG_TIMEOUT_MS = 120 * 1000;

let sdk;

// firebase.User objects
let user;
let account;
let project1;
let project2;

describe('Admin SDK', async () => {
  before(async () => {
    try {
      sdk = new DashboardSDK(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should signup andyfusniak+000@gmail.com as a new users', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let user = await sdk.signUpUser('andyfusniak+000@gmail.com', 'testtest', 'A User');
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
      let userCredential = await sdk.signInWithEmailAndPassword('andyfusniak+000@gmail.com', 'testtest');
      user = userCredential.user;
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
        sdk.getAccount(user.uid)
          .then(a => {
            if (a) {
              account = a;
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
  //    assert.strictEqual(account.accountId, user.uid);
  //    assert.strictEqual(account.name, 'Acme Inc');
  //  } catch (err) {
  //    throw err;
  //  }
  //});

  it('should retrieve account andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      account = await sdk.getAccount(user.uid);
      assert.hasAllKeys(account, [
        '_sdk',
        'accountId',
        'email',
        'privateApiKey',
        'created',
        'lastModified'
      ]);
      assert.strictEqual(account.accountId, user.uid);
      assert.strictEqual(account.email, 'andyfusniak+000@gmail.com');
    } catch (err) {
      throw err;
    }
  });


  it('should create two new projects for account one', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      project1 = await account.createProject('apple-12345', 'Apple project');
      project2 = await account.createProject('banana-45678', 'Banana project');

      assert.exists(project1, 'project1 is neither `null` nor `undefined`');
      assert.instanceOf(project1, Project, 'project1 is an instance of Project');

      assert.exists(project2, 'project2 is neither `null` nor `undefined`');
      assert.instanceOf(project2, Project, 'project2 is an instance of Project');
    } catch (err) {
      throw err;
    }
  });

  it('should fail to create a project when project aleady exists', function(done) {
    this.timeout(TIMEOUT_MS);
    account.createProject('apple-12345', 'Apple project')
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
    account.getProject('missing')
      .then(project => {
        done(project);
      })
      .catch(err => {
        if (err.code === 404) {
          return done();
        }
        done(err);
      });
  });

  // it('should check that non-existent project is available', async function() {
  //   this.timeout(TIMEOUT_MS);
  //   try {
  //     let exists = await account.isProjectIdAvailable('i-dont-exist', 'project id should be available');
  //     assert.strictEqual(exists, true);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should check that an existing project is not available', async function() {
  //   this.timeout(TIMEOUT_MS);
  //   try {
  //     let exists = await account.isProjectIdAvailable('apple-12345', 'project id should not be available');
  //     assert.strictEqual(exists, false);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should retrieve project one by projectId', async function() {
  //   this.timeout(TIMEOUT_MS);
  //   try {
  //     let project = await account.getProject(project1.projectId);
  //     assert.exists(project, 'project is neither `null` nor `undefined`');
  //     assert.containsAllKeys(project, ['accountId', 'name', 'created', 'lastModified']);
  //     assert.strictEqual(project.projectId, project1.projectId);
  //     assert.strictEqual(project.name, project1.name);
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  // it('should retrieve all projects associated with account one', async function() {
  //   this.timeout(TIMEOUT_MS);

  //   try {
  //     let projects = await account.getAllProjects();

  //     assert.isArray(projects);
  //     assert.isNotEmpty(projects);
  //     assert.lengthOf(projects, 2, 'array has length of 2');

  //     assert.typeOf(projects[0], 'object', 'we have an object');
  //     assert.typeOf(projects[1], 'object', 'we have an object');

  //     assert.strictEqual(projects[0].id, project1.id);
  //     assert.strictEqual(projects[0].name, 'Banana project');

  //     assert.strictEqual(projects[1].id, project2.id);
  //     assert.strictEqual(projects[1].name, 'Apple project');
  //   } catch (err) {
  //     throw err;
  //   }
  // });

  it('should delete user andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      await user.delete();
    } catch (err) {
      throw err;
    }
  });
});
