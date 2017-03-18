import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { ProductUsers } from 'meteor/drizzle:models';


Meteor.publish(null, function loggedInUsers() {
  return Meteor.users.find(this.userId, {
    // fields: {
    //   stripeCustomer: 1,
    //   walletBalance: 1,
    //   depositBalance: 1,
    //   isCardDeclined: 1,
    //   subscribedProducts: 1,
    //   profile: 1,
    // },
  });
});


Meteor.publish('productUsers.userSites', function userSites(params) {
  check(params, {
    offset: Number,
    limit: Number,
    productId: Match.Optional(String), // eslint-disable-line
  });

  if (!this.userId) {
    return this.ready();
  }

  const filter = { userId: this.userId, totalSpent: { $gt: 0 } };
  if (params.productId) {
    filter.productId = params.productId;
  }

  const options = {
    sort: { productTitle: 1 },
    skip: params.offset, limit: params.limit,
  };

  return ProductUsers.find(filter, options);
});
