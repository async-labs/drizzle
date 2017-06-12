import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ProductUsers, Referrals } from 'meteor/drizzle:models';


Meteor.publishComposite('referrals.getEarnedList', function getEarnedList(params) {
  check(params, {
    productId: String,
    limit: Number,
    offset: Number,
  });

  if (!this.userId) { return this.ready(); }

  return {
    find() {
      return Referrals.find(
        { earningUserId: this.userId, productId: params.productId, isEarned: true },
        { limit: params.limit, skip: params.offset }
      );
    },
    children: [{
      find(referral) {
        return ProductUsers.find({ userId: referral.givingUserId, productId: params.productId });
      },
    }],
  };
});
