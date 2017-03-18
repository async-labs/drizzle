import { Meteor } from 'meteor/meteor';

import { error, success } from '../notifier';

import {
  configWelcomeEmail as configWelcomeEmailMethod,
} from '/imports/api/products/methods';

export function toggleConfig({ name, state }, callback) {
  Meteor.call('notifications/change', name, state, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Saved.');
    }

    if (callback) { callback(err); }
  });
}

export function configWelcomeEmail({ productId, subject, body }, callback) {
  configWelcomeEmailMethod.call({ productId, subject, body }, (err) => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) { callback(err); }
  });
}
