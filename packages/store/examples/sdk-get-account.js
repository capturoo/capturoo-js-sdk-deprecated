(async () => {
  const config = require('../config');
  const DashboardSDK = require('../lib/DashboardSDK');
  const sdk = new DashboardSDK(config);

  try {
    let account = await sdk.getAccount('HNNRTYd1H9eVNmGRLUbOtTHlEkc2');
    console.log('account object...');
    console.log(account);

    console.log('account properties...');
    console.log('account.accountId = ' + account.accountId);
    console.log('account.name = ' + account.name);
    console.log('account.email = ' + account.email);
    console.log('account.privateApiKey = ' + account.privateApiKey);
    console.log('account.created = ' + account.created);
    console.log('account.lastModified = ' + account.lastModified);
  } catch (err) {
    console.error(err);
  }
})();
