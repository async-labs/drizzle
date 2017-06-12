import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';

import {
  Products,
  KeyValues,
} from 'meteor/drizzle:models';

Meteor.publish('myProducts', function myProducts(params) {
  check(params, {
    limit: Match.Optional(Number), // eslint-disable-line new-cap
  });

  if (!this.userId) {
    return this.ready();
  }

  const options = {
    // limit: params.limit || 20,
    sort: { domain: 1 },
    fields: { ispAPI: 0 },
  };

  const user = Meteor.users.findOne(this.userId);

  const filter = {};
  if (!user.isAdmin()) {
    filter.vendorUserId = this.userId;
  }

  const subs = [
    Products.find(filter, options),
    KeyValues.find({ key: { $in: ['stripePublishableKey', 'stripeSecretKey'] } }),
  ];

  if (user.isAdmin()) {
    const vendorIds = Products.find(
      filter, _.extend({}, options, { fields: { vendorUserId: 1 } })).map(u => u.vendorUserId);

    subs.push(Meteor.users.find(
      { _id: { $in: _.uniq(vendorIds) } },
      { fields: { payoutConfig: 1 } }
    ));
  }

  return subs;
});

Meteor.publish('myProductBySlug', function myProductBySlug(slug) {
  check(slug, String);

  if (!this.userId) { return this.ready(); }

  const user = Meteor.users.findOne(this.userId);

  const filter = {};
  if (!user.isAdmin()) {
    filter.vendorUserId = this.userId;
  }

  return Products.find(filter);
});

Meteor.publish('myProductById', function myProductById(id) {
  check(id, String);

  if (!this.userId) { return this.ready(); }


  const user = Meteor.users.findOne(this.userId);

  const filter = { _id: id };
  if (!user.isAdmin()) {
    filter.vendorUserId = this.userId;
  }

  return Products.find(filter, { fields: { ispAPI: 0, 'vimeoToken.accessToken': 0 } });
});
