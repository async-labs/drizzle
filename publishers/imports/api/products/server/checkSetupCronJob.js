import { SyncedCron } from 'meteor/percolate:synced-cron';

import { checkSetup } from 'meteor/drizzle:check-functions';
import { Products } from 'meteor/drizzle:models';

function checkInstallScript() {
  const products = Products.find(
    { isScriptInstalled: { $ne: true } },
    { fields: { claimStatus: 1, url: 1, verifyKey: 1 } }
  ).fetch();

  products.forEach((product) => {
    const { installed, verified } = checkSetup(product);

    const modifier = {
      $set: {
        isScriptInstalled: installed,
      },
    };

    if (product.claimStatus !== 'verified' && verified) {
      modifier.$set.claimStatus = 'verified';
    }

    Products.update(product._id, modifier);
  });
}

SyncedCron.add({
  name: 'Products checking script installation',

  schedule(parser) {
    // return parser.text('every 30 seconds');
    return parser.text('every 1 hour');
  },

  job() {
    checkInstallScript();
  },
});
