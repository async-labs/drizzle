import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { DailyAccessCharges } from 'meteor/drizzle:models';

Meteor.publish('dailyAccess.activeAccess', function activeAccess(productId) {
  check(productId, String);

  if (!this.userId) {
    return this.ready();
  }

  const now = new Date();

  return DailyAccessCharges.find({
    userId: this.userId,
    productId,
    endAt: { $gte: now },
  });
});
