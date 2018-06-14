(async () => {
  const config = require('../config');
  const DashboardSDK = require('../lib/DashboardSDK');
  const sdk = new DashboardSDK(config);

  try {
    let email = 'andyfusniak+test807@gmail.com';
    let password = 'testtest';
    let displayName = 'Andy Fusniak';

    let user = await sdk.signupUser(email, password, displayName);
    console.log('user object...');
    console.log(user);

    console.log('user properties...');
    console.log('user.uid=' + user.uid);
    console.log('user.email=' + user.email);
    console.log('user.displayName=' + user.displayName);
    console.log('user.created=' + user.created);
  } catch (err) {
    console.error(err);
  }
})();
