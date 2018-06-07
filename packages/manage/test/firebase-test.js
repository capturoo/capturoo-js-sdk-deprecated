const chai = require('chai');
const assert = chai.assert;
const firebase = require('firebase');
const firestore = require('firebase/firestore');
const config = require('../config');

describe('Firestore', async () => {
  // it('should connect to firebase', async function() {
  //   this.timeout(5000);
  //   firebase.initializeApp(config.firebase);
  //   let db = firebase.firestore();

  //   console.log(firebase.firestore.FieldValue.serverTimestamp());

  //   try {
  //     let docRef = await db.collection('users').add({
  //       first: "Ada",
  //       last: "Lovelace",
  //       born: 1815,
  //       created: firebase.firestore.FieldValue.serverTimestamp()
  //     });
  //     console.log(docRef.id);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // });
});
