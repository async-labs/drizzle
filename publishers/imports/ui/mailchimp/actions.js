import { error, success } from '../notifier';

import { Meteor } from 'meteor/meteor';

export function configMailchimp(data, callback) {
  Meteor.call('products.configMailchimp', data, (err) => {
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
