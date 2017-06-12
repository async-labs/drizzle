import { Meteor } from 'meteor/meteor';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { error, success } from '/imports/notifier';

export function toggleSubscribe(
  { productId, planId, wallId, subscribe, weekly, monthly, annual, freeTrial },
  callback
) {
  Meteor.call('products.toggleSubscribe',
    { productId, planId, wallId, subscribe, weekly, monthly, annual, freeTrial }, (err, result) => {
      if (err) {
        if (err.error === 'card-required') {
          FlowRouter.go('/card-info');
        }
        error(err);
      } else {
        success('Saved');
      }

      if (callback) { callback(err, result); }
    });
}
