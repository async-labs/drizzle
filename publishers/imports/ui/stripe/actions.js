import { error, success } from '../notifier';

import { Meteor } from 'meteor/meteor';

export function configStripe(data, callback) {
  Meteor.call('products.configStripe', data, (err) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Saved');
    }

    if (callback) {
      callback(err);
    }
  });
}
