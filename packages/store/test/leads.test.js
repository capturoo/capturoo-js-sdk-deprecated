'use strict';
const capturoo = require('@capturoo/app');
require('@capturoo/auth');
require('@capturoo/capture');
require('@capturoo/store');

const chai = require('chai');
const assert = chai.assert;
const config = require('../config');

const TIMEOUT_MS = 20 * 1000;
const SUPER_LONG_TIMEOUT_MS = 30 * 1000;

const leadsToBuild = [
  { email: 'andy@example.com', firstname: 'Andy', lastname: 'Andrews' },
  { email: 'bob@example.com', firstname: 'Bob', lastname: 'Bothersome' },
  { email: 'carl@example.com', firstname: 'Carl', lastname: 'Carrots' },
  { email: 'derek@example.com', firstname: 'Derek', lastname: 'Derby' },
  { email: 'earl@example.com', firstname: 'Earl', lastname: 'Ericson' },
  { email: 'freddy@example.com', firstname: 'Freddy', lastname: 'Frog' },
  { email: 'george@example.com', firstname: 'George', lastname: 'Georgia' },
  { email: 'harry@example.com', firstname: 'Harry', lastname: 'Happy' },
  { email: 'irk@example.com', firstname: 'Irk', lastname: 'Irkison' },
  { email: 'john@example.com', firstname: 'John', lastname: 'Johnson' }
];

const TEST_ACCOUNT_EMAIL = process.env.TEST_ACCOUNT_EMAIL || 'acme+143@foo.bar';

let user;
let accountDocRef;
let accountDocSnap;
let projectDocRef;
var leads = [];

describe('Leads', async () => {
  before(async () => {
    try {
      capturoo.initApp(config);
    } catch (err) {
      console.error(err);
    }
  });

  it('should create a new Acme Widget Inc account', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      user = await capturoo.auth()
        .signUpUser(TEST_ACCOUNT_EMAIL, 'testtest', 'Acme Widgets Inc');
      assert.hasAllKeys(user, [
        'uid',
        'email',
        'displayName',
        'created'
      ]);
      assert.strictEqual(user.displayName, 'Acme Widgets Inc');
    } catch (err) {
      throw err;
    }
  });

  it('should log in as user A', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let userCredential = await capturoo.auth()
        .signInWithEmailAndPassword(TEST_ACCOUNT_EMAIL, 'testtest');
      user = userCredential.user;
      capturoo.store().setToken(capturoo.auth().getToken());
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
        capturoo.store().accounts().doc(user.uid).get()
          .then(a => {
            if (a) {
              accountDocSnap = a;
              accountDocRef = a.ref;
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

  it('should create a new project for account Acme Widgets Inc', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      projectDocRef = await accountDocRef.projects().add({
        pid: 'big-promo-project',
        projectName: 'Big Promo Project'
      });

      let projectSnapshot = await projectDocRef.get();
      let data = projectSnapshot.data();
      assert.exists(projectSnapshot.exists, true);
      assert.hasAllDeepKeys(data, {
        pid: true,
        projectName: true,
        leadsCount: true,
        publicApiKey: true,
        created: true,
        lastModified: true
      });
      assert.strictEqual(data.pid, 'big-promo-project');
      assert.strictEqual(data.projectName, 'Big Promo Project');
      assert.strictEqual(data.leadsCount, 0);
    } catch (err) {
      throw err;
    }
  });

  it('should create a series of new leads', async function() {
    this.timeout(TIMEOUT_MS);

    try {
      let projectDocSnap = await projectDocRef.get();
      let projectData = projectDocSnap.data();
      capturoo.capture().setPublicApiKey(`${projectData.publicApiKey}${accountDocSnap.aid}`);

      let data = [];
      for (const lead of leadsToBuild) {
        let l = await capturoo.capture().createLead(lead, {});
        data.push(l);
      }

      data.map(function(item) {
        leads[item.lead.email] = item;
        assert.exists(leads[item.lead.email], 'project is neither `null` nor `undefined`');

        assert.hasAllDeepKeys(leads[item.lead.email], {
          system: {
            leadNum: true,
            ip: true,
            created: true,
            lid: true
          },
          lead: {
            email: true,
            lastname: true,
            firstname: true
          },
          tracking: {}
        });
      });
    } catch (err) {
      throw err;
    }
  });

  it('should get a specific lead', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let lid = leads['andy@example.com'].system.lid;
      let leadDocRef = projectDocRef.leads().doc(lid);

      let docSnap = await leadDocRef.get();
      let data = docSnap.data();

      assert.strictEqual(
        data.lead.email,
        leads['andy@example.com'].lead.email
      );
      assert.strictEqual(
        data.lead.firstname,
        leads['andy@example.com'].lead.firstname
      );
      assert.strictEqual(
        data.lead.lastname,
        leads['andy@example.com'].lead.lastname
      );
    } catch (err) {
      throw err;
    }
  });

  it('should fetch all leads for given project', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let leadsQueryDocumentSnapshot = await projectDocRef.leads().get();

      let resultLeads = leadsQueryDocumentSnapshot.docs();

      resultLeads.map(function(item) {
        let data = item.data();
        let email = data.lead.email;

        assert.strictEqual(
          data.lead.email,
          leads[email].lead.email
        );
        assert.strictEqual(
          data.lead.firstname,
          leads[email].lead.firstname
        );
        assert.strictEqual(
          data.lead.lastname,
          leads[email].lead.lastname
        );
      });
    } catch (err) {
      throw err;
    }
  });

  it('should delete each of the leads in the set in turn', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      let leadsQueryDocumentSnapshot = await projectDocRef.leads().get();
      let resultLeads = leadsQueryDocumentSnapshot.docs();

      for (const lead of resultLeads) {
        await lead.delete();
      }
    } catch (err) {
      throw err;
    }
  });

  it('should delete user', async function() {
    this.timeout(TIMEOUT_MS);
    try {
      await user.delete();
    } catch (err) {
      throw err;
    }
  });
});
