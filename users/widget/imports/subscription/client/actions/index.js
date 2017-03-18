import { Meteor } from 'meteor/meteor';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { error, success } from '/imports/notifier';

function callMethod({ name, productId, wallId, callback }) {
  Meteor.call(
    name,
    { productId, wallId },
    (err, result) => {
      if (err) {
        if (err.error === 'card-required') {
          FlowRouter.go('/card-info');
        }
        error(err);
      } else {
        success('Saved');
      }

      if (callback) { callback(err, result); }
    }
  );
}

export function subscribeMonthly({ productId, wallId }, callback) {
  callMethod({ name: 'products.subscribeMonthly', productId, wallId, callback });
}

export function subscribeFreetrial({ productId, wallId }, callback) {
  callMethod({ name: 'products.subscribeFreetrial', productId, wallId, callback });
}

export function unsubscribeMonthly({ productId, wallId }, callback) {
  callMethod({ name: 'products.unsubscribeMonthly', productId, wallId, callback });
}

export function unsubscribeFreetrial({ productId, wallId }, callback) {
  callMethod({ name: 'products.unsubscribeFreetrial', productId, wallId, callback });
}
