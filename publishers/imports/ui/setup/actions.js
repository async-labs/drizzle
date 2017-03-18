import { Meteor } from 'meteor/meteor';

import { error, success } from '../notifier';

export function deleteKey(productId, callback) {
  Meteor.call('wpPlugin.deleteKey', { productId }, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Key is deleted.');
    }

    if (callback) { callback(err); }
  });
}

export function generateKey(productId, callback) {
  Meteor.call('wpPlugin.generateKey', { productId }, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Key is generated.');
    }

    if (callback) { callback(err); }
  });
}

export function checkStatus(productId, callback) {
  Meteor.call('products.checkScriptInstallation', productId, (err, res) => {
    if (callback) { callback(err, res); }
  });
}
