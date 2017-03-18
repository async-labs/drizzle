import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { Subscriptions } from 'meteor/drizzle:models';

Meteor.publish('subscription.getCurrentSubscription', function getCurrentSubscription(productId) {
  check(productId, String);

  if (!this.userId) {
    return this.ready();
  }

  const now = new Date();

  return Subscriptions.find({
    userId: this.userId,
    productId,
    endAt: { $gte: now },
  });
});
