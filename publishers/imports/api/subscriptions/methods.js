import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Products, Subscriptions } from 'meteor/drizzle:models';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';

Meteor.methods({
  'products/configSubscription'(productId, params) {
    check(productId, String);
    check(params, {
      amount: Number,
      stripePlanId: String,
    });

    const data = params;
    if (data.amount < 5 || data.amount > 50) {
      throw new Meteor.Error(
        'invalid-data',
        'Wrong amount. Subscription fee must be between $5 and $50.'
      );
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    data.amount *= 100;
    const oldAmount = product.subscription && product.subscription.amount;
    if (oldAmount && data.amount !== oldAmount) {
      data.oldAmount = oldAmount;
    }

    data.changedAt = new Date();

    Products.update(productId, {
      $set: {
        subscription: data,
      },
    });
  },

  'products/toggleSubscription'(productId, state) {
    check(productId, String);
    check(state, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (Subscriptions.find(
      {
        productId, monthly: true, imported: { $exists: false },
        endAt: { $gte: new Date() },
      }
    ).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an active subscription. So you can not disable subscription.'
      );
    }

    Products.update(productId,
      { $set: { subscriptionEnabled: state } }
    );
  },
});
