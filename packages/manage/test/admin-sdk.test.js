const chai = require('chai');
const assert = chai.assert;

const capturoo = require('@capturoo/app');
require('@capturoo/auth');
require('@capturoo/manage');

const config = require('../config');
const Project = require('@capturoo/manage').Project;

const TIMEOUT_MS = 20 * 1000;
const SUPER_LONG_TIMEOUT_MS = 120 * 1000;

let auth;
let manage;

let user;
let account;
let project1;
let project2;

describe('Manage SDK', async () => {
  before(async () => {
    try {
      capturoo.initApp(config);
      auth = capturoo.auth(config);
      manage = capturoo.manage(config);
    } catch (err) {
      console.error(err);
    }
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
      manage.setToken(await auth.getToken());
      assert.isObject(user, 'user should be an object type');
      assert.strictEqual(user.emailVerified, false);
    } catch (err) {
      throw err;
    }
  });

  it('should wait for GCF to generate new account', function dsgdsfgsdfgsdfgdsfgdfsg(done) {
    this.timeout(SUPER_LONG_TIMEOUT_MS);
    function keepChecking() {
      setTimeout(function() {
        manage.account(user.uid)
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
  //    assert.strictEqual(account.aid, user.uid);
  //    assert.strictEqual(account.name, 'Acme Inc');
  //  } catch (err) {
  //    throw err;
  //  }
  //});

  it('should retrieve account andyfusniak+000@gmail.com', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      account = await manage.account(user.uid);
      assert.hasAllKeys(account, [
        '_sdk',
        'aid',
        'email',
        'privateApiKey',
        'created',
        'lastModified'
      ]);
      assert.strictEqual(account.aid, user.uid);
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

  it('should fail to create a project (aleady exists)', function(done) {
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
    account.project('missing')
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
      let project = await account.project(project1.pid);
      assert.exists(project, 'project is neither `null` nor `undefined`');
      assert.containsAllKeys(project, [
        'accountId',
        "leadsCount",
        "projectId",
        "projectName",
        "publicApiKey",
        'created',
        'lastModified'
      ]);
      //assert.strictEqual(project.pid, project1.pid);
      //assert.strictEqual(project.name, project1.name);
    } catch (err) {
      throw err;
    }
  });

  // it('should retrieve all projects associated with account one', async function() {
  //   this.timeout(TIMEOUT_MS);

  //   try {
  //     let projects = await account.projects();

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
